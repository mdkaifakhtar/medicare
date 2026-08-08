import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { issueTokens, verifyRefreshToken } from '../utils/jwt.js';
import AuditLog from '../models/AuditLog.js';
import { sendMail } from '../services/emailService.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';


export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens');
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
  if (user.status !== 'active') return res.status(403).json({ message: 'Account is suspended or pending approval. Contact administrator.' });

  user.lastLogin = new Date();
  user.loginHistory = [{ at: new Date(), ip: req.ip, device: req.get('User-Agent')?.slice(0, 40) || 'web' }, ...(user.loginHistory || [])].slice(0, 10);

  const { accessToken, refreshToken } = issueTokens(user);
  user.refreshTokens = [refreshToken, ...(user.refreshTokens || [])].slice(0, 5);
  await user.save();

  await AuditLog.create({ userId: user._id, userName: user.name, role: user.role, action: 'LOGIN', entity: 'user', entityId: String(user._id), detail: `${user.name} logged in`, ip: req.ip });

  res.json({ user: user.toJSON(), accessToken, refreshToken });
};

export const register = async (req, res) => {
  const { name, email, password, phone, gender, age, bloodGroup, address, emergencyContact } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const avatar = name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();
  const user = await User.create({ name, email, password, phone, role: 'patient', avatar, status: 'active' });
  const patient = await Patient.create({ userId: user._id, name, gender: gender || 'Other', age: age || 25, bloodGroup: bloodGroup || 'Unknown', phone, email, address: address || '', emergencyContact: emergencyContact || '', avatar });
  user.patientId = patient._id;

  const { accessToken, refreshToken } = issueTokens(user);
  user.refreshTokens = [refreshToken];
  await user.save();

  await AuditLog.create({ userId: user._id, userName: user.name, role: 'patient', action: 'REGISTER', entity: 'user', entityId: String(user._id), detail: `${name} registered as patient` });
  sendMail({ to: user.email, subject: 'Welcome to MedCare', html: `<p>Hi ${name}, your MedCare patient account is ready.</p>` });

  res.status(201).json({ user: user.toJSON(), accessToken, refreshToken });
};

export const refresh = async (req, res) => {
  const token = req.body?.refreshToken || req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'Refresh token required' });
  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user || !(user.refreshTokens || []).includes(token)) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const tokens = issueTokens(user);
    user.refreshTokens = [tokens.refreshToken, ...user.refreshTokens.filter((t) => t !== token)].slice(0, 5);
    await user.save();
    res.json({ user: user.toJSON(), ...tokens });
  } catch {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

export const logout = async (req, res) => {
  const token = req.body?.refreshToken || req.cookies?.refreshToken;
  if (token) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.id).select('+refreshTokens');
      if (user) {
        user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== token);
        await user.save();
      }
    } catch {
      /* token already invalid — nothing to revoke */
    }
  }
  res.json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  res.json({ user: req.user.toJSON() });
};

export const updateProfile = async (req, res) => {
  const updates = { ...req.body };
  delete updates.password;
  delete updates.role;
  delete updates.email;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ user: user.toJSON() });
};

/**
 * POST /api/auth/me/photo  (multipart, field name: "photo")
 * Stores the profile photo with the existing upload pipeline — Cloudinary when
 * configured, otherwise the local /uploads folder — and saves the resulting
 * path on the existing User.picture field. JWT-protected via `protect`.
 */
const PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export const uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'A photo file is required' });

  const discard = () => { try { fs.unlinkSync(req.file.path); } catch { /* already gone */ } };

  if (!PHOTO_TYPES.includes(req.file.mimetype)) {
    discard();
    return res.status(415).json({ message: 'Only JPG, JPEG, PNG, and WEBP images are supported' });
  }
  if (req.file.size > MAX_PHOTO_BYTES) {
    discard();
    return res.status(413).json({ message: 'Profile photo must be 5 MB or smaller' });
  }

  let url = `/uploads/${path.basename(req.file.path)}`;
  let publicId = null;
  try {
    const result = await uploadToCloudinary(req.file.path, 'medcare/avatars');
    if (result?.url) { url = result.url; publicId = result.publicId || null; discard(); }
  } catch {
    // Cloudinary unavailable — keep the local /uploads URL.
  }

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.picturePublicId && user.picturePublicId !== publicId) {
    try { await deleteFromCloudinary(user.picturePublicId); } catch { /* best effort */ }
  }
  user.picture = url;
  user.picturePublicId = publicId;
  await user.save();

  await AuditLog.create({
    userId: user._id, userName: user.name, role: user.role,
    action: 'UPDATE', entity: 'user', entityId: String(user._id),
    detail: `${user.name} updated their profile photo`, ip: req.ip,
  });

  res.json({ user: user.toJSON(), picture: url });
};

/** DELETE /api/auth/me/photo — clears the profile photo. */
export const removeAvatar = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.picturePublicId) {
    try { await deleteFromCloudinary(user.picturePublicId); } catch { /* best effort */ }
  } else if (user.picture?.startsWith('/uploads/')) {
    try { fs.unlinkSync(path.resolve('uploads', path.basename(user.picture))); } catch { /* already gone */ }
  }
  user.picture = '';
  user.picturePublicId = null;
  await user.save();

  res.json({ user: user.toJSON(), picture: '' });
};


export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
};

export const listUsers = async (req, res) => {
  const { role, status, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const items = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await User.countDocuments(filter);
  res.json({ items, total, page: Number(page), limit: Number(limit), totalPages: Math.max(1, Math.ceil(total / Number(limit))) });
};
