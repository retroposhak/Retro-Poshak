import { Coupon } from '../models/Coupon.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/coupons/:code  — validate a coupon against the user's current cart total
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { subtotal } = req.query;

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw ApiError.badRequest('Invalid coupon code');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw ApiError.badRequest('This coupon has expired');
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw ApiError.badRequest('This coupon is no longer available');
  }

  const sub = Number(subtotal || 0);
  if (sub < coupon.minOrderValue) {
    throw ApiError.badRequest(
      `Minimum order of ₹${coupon.minOrderValue} required for this coupon`
    );
  }

  // Compute the discount preview
  let discount = 0;
  if (coupon.type === 'percent') {
    discount = Math.round((sub * coupon.value) / 100);
    if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = Math.min(coupon.value, sub);
  }

  res.json({
    success: true,
    coupon: {
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      discount,
    },
  });
});