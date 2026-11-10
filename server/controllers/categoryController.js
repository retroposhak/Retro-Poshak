import { Category } from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listCategories = asyncHandler(async (_req, res) => {
  const cats = await Category.find({ isActive: true }).sort({ order: 1 }).lean();
  res.json({ success: true, categories: cats });
});