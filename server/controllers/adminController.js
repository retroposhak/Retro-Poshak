import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Coupon } from '../models/Coupon.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ORDER_STATUS, COLOR_HEX } from '../utils/constants.js';
import { uploadToCloudinary } from '../middleware/upload.js';
import { restoreStock } from '../services/stockService.js';

export const stats = asyncHandler(async (_req, res) => {
  const [revenueAgg, orderCount, customerCount, lowStock, recentOrders] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Product.aggregate([
      { $unwind: '$variants' },
      { $match: { 'variants.stock': { $lte: 3 } } },
      { $group: { _id: '$_id', name: { $first: '$name' }, minStock: { $min: '$variants.stock' } } },
      { $sort: { minStock: 1 } },
      { $limit: 5 },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).select('orderId total status createdAt'),
  ]);

  res.json({
    success: true,
    stats: {
      revenue: revenueAgg[0]?.total || 0,
      orders: orderCount,
      customers: customerCount,
      lowStock,
      recentOrders,
    },
  });
});

export const listProducts = asyncHandler(async (req, res) => {
  const { q = '', page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q.trim()) filter.name = new RegExp(q.trim(), 'i');

  const skip = (Math.max(1, Number(page)) - 1) * Math.min(50, Number(limit));
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    items,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');
  res.json({ success: true, product });
});

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body.name || !body.price) throw ApiError.badRequest('Name and price are required');

  const slug = body.slug?.trim() || slugify(body.name);
  const existing = await Product.findOne({ slug });
  if (existing) throw ApiError.conflict('A product with that slug already exists');

  const colors = body.colors || [];
  const sizes = body.sizes || ['S', 'M', 'L', 'XL', 'XXL'];
  const defaultStock = Number(body.defaultStock ?? 8);
  const variants = [];
  for (const c of colors) {
    for (const s of sizes) {
      variants.push({ size: s, colour: c, stock: defaultStock, sku: `${slug}-${c}-${s}` });
    }
  }

  const product = await Product.create({
    name: body.name.trim(),
    slug,
    subtitle: body.subtitle || '',
    description: body.description || '',
    price: Number(body.price),
    compareAt: Number(body.compareAt || 0),
    images: body.images || [],
    heroImage: body.images?.[0] || '',
    colorImages: body.colorImages || {}, // Added
    colors,
    colorHex: Object.fromEntries(
      colors.filter((c) => COLOR_HEX[c]).map((c) => [c, COLOR_HEX[c]])
    ),
    sizes,
    variants,
    categories: body.categories || [],
    isFeatured: !!body.isFeatured,
    isActive: body.isActive !== false,
  });

  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');

  const b = req.body;
  if (b.name) product.name = b.name.trim();
  if (b.subtitle !== undefined) product.subtitle = b.subtitle;
  if (b.description !== undefined) product.description = b.description;
  if (b.price !== undefined) product.price = Number(b.price);
  if (b.compareAt !== undefined) product.compareAt = Number(b.compareAt);
  if (b.categories) product.categories = b.categories;
  if (b.isFeatured !== undefined) product.isFeatured = !!b.isFeatured;
  if (b.isActive !== undefined) product.isActive = !!b.isActive;
  if (b.images) {
    product.images = b.images;
    product.heroImage = b.images[0] || '';
  }
  
  // Added
  if (b.colorImages) product.colorImages = b.colorImages;

  if (b.variantStocks && typeof b.variantStocks === 'object') {
    for (const v of product.variants) {
      const key = `${v.colour}|${v.size}`;
      if (typeof b.variantStocks[key] === 'number') {
        v.stock = Math.max(0, b.variantStocks[key]);
      }
    }
  }

  await product.save();
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');
  await product.deleteOne();
  res.json({ success: true });
});

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw ApiError.badRequest('No files uploaded');
  }
  const urls = [];
  for (const file of req.files) {
    const result = await uploadToCloudinary(file.buffer);
    urls.push(result.secure_url);
  }
  res.json({ success: true, urls });
});

export const listCategories = asyncHandler(async (_req, res) => {
  const cats = await Category.find().sort({ order: 1 });
  res.json({ success: true, categories: cats });
});

export const listOrders = asyncHandler(async (req, res) => {
  const { status = '', page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    orders,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!Object.values(ORDER_STATUS).includes(status)) {
    throw ApiError.badRequest('Invalid status');
  }

  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound('Order not found');

  if (order.status === status) {
    return res.json({ success: true, order });
  }

  if (status === 'cancelled' && ['confirmed', 'shipped'].includes(order.status)) {
    await restoreStock(
      order.items.map((i) => ({
        productId: i.product,
        size: i.size,
        colour: i.colour,
        quantity: i.quantity,
      }))
    );
  }

  order.status = status;
  order.statusHistory.push({ status, at: new Date(), note: 'Updated by admin' });
  await order.save();

  res.json({ success: true, order });
});

export const updateOrderTracking = asyncHandler(async (req, res) => {
  const { trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound('Order not found');
  order.trackingNumber = trackingNumber || '';
  await order.save();
  res.json({ success: true, order });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { q = '', page = 1, limit = 20 } = req.query;
  const filter = { role: 'customer' };
  if (q.trim()) {
    filter.$or = [
      { name: new RegExp(q.trim(), 'i') },
      { email: new RegExp(q.trim(), 'i') },
    ];
  }
  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    users: users.map((u) => u.toSafeJSON()),
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const listCoupons = asyncHandler(async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, description, type, value, minOrderValue, maxDiscount, usageLimit, perUserLimit, expiresAt, isActive } = req.body;
  if (!code || !type || value === undefined) {
    throw ApiError.badRequest('Code, type and value are required');
  }
  const exists = await Coupon.findOne({ code: code.toUpperCase() });
  if (exists) throw ApiError.conflict('Coupon with that code already exists');

  const coupon = await Coupon.create({
    code: code.toUpperCase().trim(),
    description: description || '',
    type,
    value: Number(value),
    minOrderValue: Number(minOrderValue || 0),
    maxDiscount: Number(maxDiscount || 0),
    usageLimit: Number(usageLimit || 0),
    perUserLimit: Number(perUserLimit || 1),
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    isActive: isActive !== false,
  });
  res.status(201).json({ success: true, coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw ApiError.notFound('Coupon not found');
  Object.assign(coupon, req.body);
  await coupon.save();
  res.json({ success: true, coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});