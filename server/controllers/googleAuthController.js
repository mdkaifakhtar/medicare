import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import AuditLog from '../models/AuditLog.js';
import { issueTokens } from '../utils/jwt.js';
import { sendMail } from '../services/emailService.js';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const client = CLIENT_ID ? new OAuth2Client(CLIENT_ID) : null;

const initials = (name = '?') =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/**
 * POST /api/auth/google
 * Body: { credential } — a Google Identity Services ID token from the browser.
 *
 * Existing users (Google or local with the same email) are signed straight in.
 * Unknown emails are provisioned automatically as `patient` with a matching
 * Patient record, then issued the same JWT access + refresh token pair used by
 * the email/password flow.
 */
export const googleAuth = async (req, res) => {
  const { credential } = req.body || {};
  if (!credential) return res.status(400).json({ message: 'Google credential is required' });
  if (!client) return res.status(500).json({ message: 'GOOGLE_CLIENT_ID is not configured on the server' });

  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired Google credential' });
  }

  if (!payload?.email) return res.status(401).json({ message: 'Google account has no email' });
  if (payload.email_verified === false) return res.status(403).json({ message: 'Google email is not verified' });

  const email = payload.email.toLowerCase();
  const name = payload.name || email.split('@')[0];

  let user = await User.findOne({ email }).select('+refreshTokens');
  let created = false;

  if (!user) {
    user = new User({
      name,
      email,
      role: 'patient',
      authProvider: 'google',
      googleId: payload.sub,
      avatar: initials(name),
      picture: payload.picture || '',
      status: 'active',
    });
    const patient = await Patient.create({
      userId: user._id,
      name,
      gender: 'Other',
      age: 0,
      bloodGroup: 'Unknown',
      phone: '',
      email,
      address: '',
      emergencyContact: '',
      avatar: initials(name),
    });
    user.patientId = patient._id;
    created = true;
  } else {
    // Link the Google identity to the existing account on first Google sign-in.
    if (!user.googleId) user.googleId = payload.sub;
    if (payload.picture && !user.picture) user.picture = payload.picture;
  }

  if (user.status !== 'active') {
    return res.status(403).json({ message: 'Account is suspended or pending approval. Contact administrator.' });
  }

  user.lastLogin = new Date();
  user.loginHistory = [
    { at: new Date(), ip: req.ip, device: req.get('User-Agent')?.slice(0, 40) || 'google' },
    ...(user.loginHistory || []),
  ].slice(0, 10);

  const { accessToken, refreshToken } = issueTokens(user);
  user.refreshTokens = [refreshToken, ...(user.refreshTokens || [])].slice(0, 5);
  await user.save();

  await AuditLog.create({
    userId: user._id,
    userName: user.name,
    role: user.role,
    action: created ? 'REGISTER' : 'LOGIN',
    entity: 'user',
    entityId: String(user._id),
    detail: `${user.name} ${created ? 'registered' : 'signed in'} with Google`,
    ip: req.ip,
  });

  if (created) {
    sendMail({
      to: user.email,
      subject: 'Welcome to MedCare',
      html: `<p>Hi ${user.name}, your MedCare patient account was created with Google sign-in.</p>`,
    });
  }

  res.status(created ? 201 : 200).json({ user: user.toJSON(), accessToken, refreshToken, created });
};

export default googleAuth;
