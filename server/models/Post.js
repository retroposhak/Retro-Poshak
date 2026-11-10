import mongoose from 'mongoose';
import { BLOG_CATEGORIES } from '../utils/constants.js';

const BLOCK_TYPES = ['p', 'h2', 'h3', 'quote', 'image'];

const contentBlockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: BLOCK_TYPES, required: true },
    text: { type: String, default: '' },
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: BLOG_CATEGORIES.map((c) => c.slug),
    },
    categoryLabel: { type: String, required: true },
    coverImage: { type: String, required: true },
    publishedAt: { type: Date, required: true, index: true },
    readTimeMinutes: { type: Number, default: 4, min: 1 },
    content: { type: [contentBlockSchema], default: [] },
    isPublished: { type: Boolean, default: true },
    authorName: { type: String, default: 'The Retro Poshak Team' },
  },
  { timestamps: true }
);

postSchema.index({ category: 1, publishedAt: -1 });
postSchema.index({ title: 'text', excerpt: 'text' });

export const Post = mongoose.model('Post', postSchema);