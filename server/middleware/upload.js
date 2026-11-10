import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';
import { cloudinary, configureCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

// Use memory storage, then upload to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new ApiError(400, 'Only image files are allowed'));
    }
    cb(null, true);
  },
});

export async function uploadToCloudinary(buffer, folder = 'retro-poshak/products') {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(
      400,
      'Cloudinary is not configured. Add CLOUDINARY_* keys to server/.env'
    );
  }
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) return reject(new ApiError(500, `Cloudinary upload failed: ${err.message}`));
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}