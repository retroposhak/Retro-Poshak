import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPopulatedCart, mergeGuestCart } from '../services/cartService.js';

// GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  const data = await getPopulatedCart(req.user._id);
  res.json({ success: true, ...data });
});

// POST /api/cart/items
// body: { productId, size, colour, quantity=1 }
export const addItem = asyncHandler(async (req, res) => {
  const { productId, size, colour, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw ApiError.notFound('Product not found');

  const variant = product.variants.find((v) => v.size === size && v.colour === colour);
  if (!variant) throw ApiError.badRequest('Selected size/colour is unavailable');
  if (variant.stock <= 0) throw ApiError.badRequest('Out of stock');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existing = cart.items.find(
    (i) => String(i.product) === String(productId) && i.size === size && i.colour === colour
  );

  const qty = Math.max(1, Math.min(20, parseInt(quantity, 10) || 1));

  if (existing) {
    const max = Math.min(variant.stock, 20);
    existing.quantity = Math.min(max, existing.quantity + qty);
    existing.priceSnapshot = product.price;
  } else {
    cart.items.push({
      product: productId,
      size,
      colour,
      quantity: Math.min(variant.stock, qty),
      priceSnapshot: product.price,
    });
  }

  await cart.save();
  const data = await getPopulatedCart(req.user._id);
  res.json({ success: true, ...data });
});

// PATCH /api/cart/items/:productId
// body: { size, colour, quantity }
export const updateItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { size, colour, quantity } = req.body;

  const qty = Math.max(1, Math.min(20, parseInt(quantity, 10) || 1));

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw ApiError.notFound('Cart is empty');

  const item = cart.items.find(
    (i) => String(i.product) === String(productId) && i.size === size && i.colour === colour
  );
  if (!item) throw ApiError.notFound('Item not in cart');

  const product = await Product.findById(productId);
  const variant = product?.variants.find((v) => v.size === size && v.colour === colour);
  const max = Math.min(variant?.stock ?? 0, 20);
  item.quantity = Math.min(max, qty);
  await cart.save();

  const data = await getPopulatedCart(req.user._id);
  res.json({ success: true, ...data });
});

// DELETE /api/cart/items/:productId?size=M&colour=Beige
export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { size, colour } = req.query;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw ApiError.notFound('Cart is empty');

  cart.items = cart.items.filter(
    (i) => !(String(i.product) === String(productId) && i.size === size && i.colour === colour)
  );
  await cart.save();

  const data = await getPopulatedCart(req.user._id);
  res.json({ success: true, ...data });
});

// DELETE /api/cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ success: true, items: [], totals: { subtotal: 0, shipping: 0, discount: 0, total: 0 }, itemCount: 0 });
});

// POST /api/cart/merge
// body: { items: [{productId, size, colour, quantity}] }
export const mergeGuest = asyncHandler(async (req, res) => {
  await mergeGuestCart(req.user._id, req.body.items);
  const data = await getPopulatedCart(req.user._id);
  res.json({ success: true, ...data });
});