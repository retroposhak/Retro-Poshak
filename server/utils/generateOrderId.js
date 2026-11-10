import crypto from 'crypto';

export function generateOrderId() {
  const suffix = crypto.randomInt(0, 99_999_999).toString().padStart(8, '0');
  return `RP${suffix}`;
}