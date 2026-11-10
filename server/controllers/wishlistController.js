import { Wishlist } from '../models/Wishlist.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function getOrCreate(userId) {
  let list = await Wishlist.findOne({ user: userId });
  if (!list) list = await Wishlist.create({ user: userId, products: [] });
  return list;
}

// GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const list = await getOrCreate(req.user._id);
  const products = await Product.find({
    _id: { $in: list.products },
    isActive: true,
  });
  res.json({
    success: true,
    productIds: list.products.map(String),
    products: products.map((p) => ({
      id: String(p._id),
      name: p.name,
      slug: p.slug,
      subtitle: p.subtitle,
      price: p.price,
      images: p.images,
      colors: p.colors,
      colorHex: p.colorHex instanceof Map ? Object.fromEntries(p.colorHex) : p.colorHex,
    })),
  });
});

// POST /api/wishlist/:productId
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw ApiError.notFound('Product not found');

  const list = await getOrCreate(req.user._id);
  if (!list.products.some((id) => String(id) === String(productId))) {
    list.products.push(productId);
    await list.save();
  }
  res.json({ success: true, productIds: list.products.map(String) });
});

// DELETE /api/wishlist/:productId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const list = await getOrCreate(req.user._id);
  list.products = list.products.filter((id) => String(id) !== String(productId));
  await list.save();
  res.json({ success: true, productIds: list.products.map(String) });
});

// POST /api/wishlist/merge
// body: { productIds: string[] }
export const mergeGuestWishlist = asyncHandler(async (req, res) => {
  const ids = Array.isArray(req.body.productIds) ? req.body.productIds : [];
  if (!ids.length) return res.json({ success: true, productIds: [] });

  const valid = await Product.find({ _id: { $in: ids }, isActive: true }).select('_id');
  const list = await getOrCreate(req.user._id);
  const existing = new Set(list.products.map(String));
  for (const p of valid) {
    if (!existing.has(String(p._id))) list.products.push(p._id);
  }
  await list.save();
  res.json({ success: true, productIds: list.products.map(String) });
});