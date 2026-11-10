import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Requires a valid accessToken cookie. Attaches `req.user` (Mongoose doc).
 * If token is missing/expired → 401 so the client can attempt /refresh.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) throw ApiError.unauthorized('Not authenticated');

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized('Token expired or invalid');
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw ApiError.unauthorized('User not found');

  req.user = user;
  next();
});

/**
 * Like requireAuth but never throws — used for pages that work both
 * logged-in and logged-out (e.g. product detail with optional reviews).
 */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next();

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && user.isActive) req.user = user;
  } catch {
    /* ignore */
  }
  next();
});