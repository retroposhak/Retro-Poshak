import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

let configured = false;

export function configureCloudinary() {
  if (configured) return true;
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    return false;
  }
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
  configured = true;
  return true;
}

export function isCloudinaryConfigured() {
  return Boolean(
    env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret
  );
}

export { cloudinary };