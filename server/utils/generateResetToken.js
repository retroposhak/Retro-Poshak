import crypto from 'crypto';

/**
 * Returns { raw, hashed }. Store `hashed` in DB, email `raw` to the user.
 * SHA-256 hashing is fast (unlike bcrypt) — fine here because the token is
 * 256 bits of entropy and short-lived (10 min). We only need to prevent a
 * leaked DB snapshot from being replayable.
 */
export function generateResetToken() {
  const raw = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hashed };
}

export function hashResetToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}