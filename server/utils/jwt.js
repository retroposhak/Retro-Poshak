import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpires,
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpires,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

/**
 * Sets both auth cookies. In prod `secure: true` requires HTTPS.
 * `sameSite: 'lax'` allows the cookie to travel on top-level navigations
 * (needed for redirect-based OAuth flows later) but blocks cross-site POSTs.
 */
export function setAuthCookies(res, accessToken, refreshToken) {
  const base = {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: 'lax',
    path: '/',
  };

  res.cookie('accessToken', accessToken, {
    ...base,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    ...base,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearAuthCookies(res) {
  const base = {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: 'lax',
    path: '/',
  };
  res.clearCookie('accessToken', base);
  res.clearCookie('refreshToken', base);
}