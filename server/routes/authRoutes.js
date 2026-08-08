import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, refresh, logout, getMe, updateProfile, changePassword, listUsers, uploadAvatar, removeAvatar } from '../controllers/authController.js';
import { upload } from '../middleware/upload.js';

import { googleAuth } from '../controllers/googleAuthController.js';

import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail().withMessage('A valid email is required'), body('password').notEmpty().withMessage('Password is required')],
  validate,
  login,
);
router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register,
);
router.post('/google', authLimiter, [body('credential').notEmpty().withMessage('Google credential is required')], validate, googleAuth);
router.post('/refresh', refresh);

router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

router.post('/me/photo', protect, upload.single('photo'), uploadAvatar);
router.delete('/me/photo', protect, removeAvatar);

router.put(
  '/change-password',
  protect,
  [body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')],
  validate,
  changePassword,
);
router.get('/users', protect, authorize('super_admin', 'hospital_admin'), listUsers);

export default router;
