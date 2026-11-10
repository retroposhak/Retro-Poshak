import dotenv from 'dotenv';
// Only load .env locally. Vercel injects env vars automatically.
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

function required(name) {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(`[env] Missing required environment variable: ${name}`);
  }
  return v;
}

function optional(name, fallback = '') {
  return process.env[name] ?? fallback;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  // Use Vercel's check for production to ensure security
  isProd: optional('NODE_ENV', 'development') === 'production',
  port: Number(optional('PORT', '5000')), // Vercel ignores this, but good for local
  clientOrigin: optional('CLIENT_ORIGIN', 'http://localhost:5173'),

  mongoUri: required('MONGODB_URI'),

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpires: optional('JWT_ACCESS_EXPIRES', '15m'),
    refreshExpires: optional('JWT_REFRESH_EXPIRES', '7d'),
  },
  cookie: {
    domain: optional('COOKIE_DOMAIN', 'localhost'),
    // Ensure secure is true in production automatically
    secure: optional('COOKIE_SECURE', 'false') === 'true' || optional('NODE_ENV') === 'production',
  },

  razorpay: {
    keyId: optional('RAZORPAY_KEY_ID'),
    keySecret: optional('RAZORPAY_KEY_SECRET'),
    webhookSecret: optional('RAZORPAY_WEBHOOK_SECRET'),
  },

  cloudinary: {
    cloudName: optional('CLOUDINARY_CLOUD_NAME'),
    apiKey: optional('CLOUDINARY_API_KEY'),
    apiSecret: optional('CLOUDINARY_API_SECRET'),
  },

  mail: {
    resendApiKey: optional('RESEND_API_KEY'),
    from: optional('MAIL_FROM', 'Retro Poshak <orders@retroposhak.local>'),
  },
};