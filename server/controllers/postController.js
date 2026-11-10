import { Post } from '../models/Post.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/posts
export const listPosts = asyncHandler(async (req, res) => {
  const { category = '', q = '', page = 1, limit = 12 } = req.query;
  const filter = { isPublished: true };
  if (category) filter.category = category;
  if (q.trim()) {
    filter.$or = [
      { title: new RegExp(q.trim(), 'i') },
      { excerpt: new RegExp(q.trim(), 'i') },
    ];
  }

  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Post.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(Number(limit)),
    Post.countDocuments(filter),
  ]);

  res.json({
    success: true,
    items: items.map((p) => ({
      id: p._id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      categoryLabel: p.categoryLabel,
      coverImage: p.coverImage,
      publishedAt: p.publishedAt,
      readTimeMinutes: p.readTimeMinutes,
    })),
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

// GET /api/posts/:slug
export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, isPublished: true });
  if (!post) throw ApiError.notFound('Post not found');

  // Related: same category, exclude self, max 3
  const related = await Post.find({
    _id: { $ne: post._id },
    category: post.category,
    isPublished: true,
  }).sort({ publishedAt: -1 }).limit(3);

  res.json({
    success: true,
    post,
    related: related.map((p) => ({
      id: p._id,
      slug: p.slug,
      title: p.title,
      categoryLabel: p.categoryLabel,
      coverImage: p.coverImage,
      publishedAt: p.publishedAt,
    })),
  });
});