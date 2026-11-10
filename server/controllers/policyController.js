import { PolicyPage } from '../models/PolicyPage.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/policies/:slug
export const getPolicy = asyncHandler(async (req, res) => {
  const page = await PolicyPage.findOne({ slug: req.params.slug });
  if (!page) throw ApiError.notFound('Policy page not found');
  res.json({ success: true, page });
});

// GET /api/policies  — index of available policies
export const listPolicies = asyncHandler(async (_req, res) => {
  const pages = await PolicyPage.find().select('slug title updatedAt');
  res.json({ success: true, pages });
});