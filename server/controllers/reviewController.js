import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ORDER_STATUS } from '../utils/constants.js';

async function recalcRating(productId) {
  const agg = await Review.aggregate([
    { $match: { product: productId, isHidden: false } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = agg[0] || {};
  await Product.updateOne(
    { _id: productId },
    { $set: { rating: Math.round(avg * 10) / 10, reviewCount: count } }
  );
}

// GET /api/products/:productId/reviews
export const listReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    product: req.params.productId,
    isHidden: false,
  })
    .sort({ createdAt: -1 })
    .populate('user', 'name');

  res.json({
    success: true,
    reviews: reviews.map((r) => ({
      id: r._id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      userName: r.user?.name || 'Anonymous',
      createdAt: r.createdAt,
    })),
  });
});

// POST /api/products/:productId/reviews
// body: { rating, title, body }
export const createReview = asyncHandler(async (req, res) => {
  const { rating, title = '', body = '' } = req.body;
  if (rating < 1 || rating > 5) throw ApiError.badRequest('Rating must be 1–5');

  // Verified purchase: user must have a delivered/confirmed order with this product
  const order = await Order.findOne({
    user: req.user._id,
    'items.product': req.params.productId,
    status: { $in: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED] },
  });
  if (!order) {
    throw ApiError.forbidden('You can only review products you have purchased');
  }

  try {
    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      order: order._id,
      rating,
      title,
      body,
      isVerifiedPurchase: true,
    });
    await recalcRating(review.product);
    res.status(201).json({ success: true, review });
  } catch (err) {
    if (err.code === 11000) {
      throw ApiError.conflict('You have already reviewed this product');
    }
    throw err;
  }
});