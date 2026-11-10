import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ROLES } from '../utils/constants.js';

export async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = process.env.ADMIN_NAME || 'Retro Admin';

  if (!email || !password) {
    throw new Error(
      '[seed:admin] ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env'
    );
  }
  if (password.length < 8) {
    throw new Error('[seed:admin] ADMIN_PASSWORD must be at least 8 characters');
  }

  const existing = await User.findOne({ email }).select('+password');

  if (existing) {
    existing.name = name;
    existing.role = ROLES.ADMIN;
    existing.password = password; // pre('save') hashes it
    existing.isActive = true;
    await existing.save();
    console.log(`[seed:admin] Updated existing admin: ${email}`);
    return existing;
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: ROLES.ADMIN,
    isActive: true,
  });
  console.log(`[seed:admin] Created new admin: ${email}`);
  return admin;
}

// Allow running directly:  node scripts/seedAdmin.js
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('seedAdmin.js')) {
  (async () => {
    try {
      await connectDB();
      await seedAdmin();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('[seed:admin] Failed:', err.message);
      await disconnectDB().catch(() => {});
      process.exit(1);
    }
  })();
}