import mongoose from 'mongoose';
import { COLLECTIONS } from '../utils/constants.js';

const categorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: COLLECTIONS,
      lowercase: true,
      trim: true,
    },
    label: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', categorySchema);