import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    source: { type: String, default: 'footer' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Newsletter = mongoose.model('Newsletter', newsletterSchema);