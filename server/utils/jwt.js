import jwt from 'jsonwebtoken';

const ACCESS_SECRET = () => process.env.JWT_SECRET || 'medcare_dev_secret';
const REFRESH_SECRET = () => process.env.JWT_REFRESH_SECRET || 'medcare_dev_refresh_secret';

export const signToken = (payload) =>
  jwt.sign(payload, ACCESS_SECRET(), { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const signAccessToken = signToken;

export const signRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_SECRET(), { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });

export const verifyToken = (token) => jwt.verify(token, ACCESS_SECRET());

export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET());

export const issueTokens = (user) => ({
  accessToken: signAccessToken({ id: user._id, role: user.role }),
  refreshToken: signRefreshToken({ id: user._id, role: user.role }),
});
