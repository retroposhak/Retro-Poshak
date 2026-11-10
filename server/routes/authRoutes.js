import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '../validators/authValidator.js';
import {
  register,
  login,
  logout,
  refresh,
  me,
  updateProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

// Public
router.post('/register', authLimiter, validate({ body: registerSchema }), register);
router.post('/login', authLimiter, validate({ body: loginSchema }), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate({ body: forgotPasswordSchema }),
  forgotPassword
);
router.post(
  '/reset-password',
  passwordResetLimiter,
  validate({ body: resetPasswordSchema }),
  resetPassword
);

// Protected
router.get('/me', requireAuth, me);
router.patch(
  '/me',
  requireAuth,
  validate({ body: updateProfileSchema }),
  updateProfile
);

export default router;