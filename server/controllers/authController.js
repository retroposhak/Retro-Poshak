import crypto from 'crypto';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from '../utils/jwt.js';
import { generateResetToken, hashResetToken } from '../utils/generateResetToken.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

function issueTokens(user, res) {
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ sub: user._id.toString() });
  setAuthCookies(res, accessToken, refreshToken);
}

// ── REGISTER ───────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone = '', password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const user = await User.create({ name, email, phone, password });

  issueTokens(user, res);
  res.status(201).json({ success: true, user: user.toSafeJSON() });
});

// ── LOGIN ──────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isActive) {
    // Same message for both branches → don't leak which emails exist
    throw ApiError.unauthorized('Invalid email or password');
  }

  const ok = await user.comparePassword(password);
  if (!ok) throw ApiError.unauthorized('Invalid email or password');

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  issueTokens(user, res);
  res.json({ success: true, user: user.toSafeJSON() });
});

// ── LOGOUT ─────────────────────────────────────
export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out' });
});

// ── REFRESH ────────────────────────────────────
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw ApiError.unauthorized('No refresh token');

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    clearAuthCookies(res);
    throw ApiError.unauthorized('Refresh token expired');
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    clearAuthCookies(res);
    throw ApiError.unauthorized('User not found');
  }

  issueTokens(user, res);
  res.json({ success: true });
});

// ── ME ─────────────────────────────────────────
export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() });
});

// ── UPDATE PROFILE ─────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  req.user.name = name;
  req.user.phone = phone ?? req.user.phone;
  await req.user.save();
  res.json({ success: true, user: req.user.toSafeJSON() });
});

// ── FORGOT PASSWORD ────────────────────────────
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Always respond success so attackers can't enumerate accounts
  if (!user) {
    return res.json({
      success: true,
      message: 'If that email is registered, a reset link is on its way.',
    });
  }

  const { raw, hashed } = generateResetToken();
  user.passwordResetToken = hashed;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user.email, user.name, raw);
  } catch (err) {
    console.error('[auth] password reset email failed:', err.message);
    // Still return success — do not leak infra issues to client
  }

  res.json({
    success: true,
    message: 'If that email is registered, a reset link is on its way.',
  });
});

// ── RESET PASSWORD ─────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const hashed = hashResetToken(token);

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  }).select('+password +passwordResetToken +passwordResetExpires');

  if (!user) throw ApiError.badRequest('Reset link is invalid or has expired');

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Auto-login after reset
  issueTokens(user, res);
  res.json({ success: true, user: user.toSafeJSON() });
});