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
 * Sets both auth cookies. 
 * In production (Vercel cross-domain), we MUST use sameSite: 'none' and secure: true.
 * In development (localhost), we use sameSite: 'lax' and secure: false.
 */
export function setAuthCookies(res, accessToken, refreshToken) {
  const base = {
    httpOnly: true,
    secure: env.isProd, // true in production, false locally
    sameSite: env.isProd ? 'none' : 'lax', // 'none' allows cross-domain cookies
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
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    path: '/',
  };
  res.clearCookie('accessToken', base);
  res.clearCookie('refreshToken', base);
}