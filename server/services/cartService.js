import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { computeTotals } from './pricingService.js';

/**
 * Fetches the user's cart (or creates an empty one) and returns
 * { items, totals } with fresh product data attached.
 */
export async function getPopulatedCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const productIds = cart.items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const items = [];
  for (const item of cart.items) {
    const p = byId.get(String(item.product));
    if (!p) continue; // product removed from catalog — silently drop

    // Find the matching variant to ensure stock exists
    const variant = p.variants.find(
      (v) => v.size === item.size && v.colour === item.colour
    );
    const availableStock = variant?.stock ?? 0;

    items.push({
      productId: String(p._id),
      product: {
        _id: p._id,
        name: p.name,
        slug: p.slug,
        image: p.images?.[0] || '',
        images: p.images || [],
        colorHex: p.colorHex instanceof Map ? Object.fromEntries(p.colorHex) : p.colorHex,
      },
      size: item.size,
      colour: item.colour,
      quantity: item.quantity,
      price: p.price, // current price, not snapshot
      compareAt: p.compareAt,
      lineTotal: p.price * item.quantity,
      availableStock,
      priceChanged: p.price !== item.priceSnapshot,
    });
  }

  const totals = computeTotals({ items, prepaid: false });
  return { cartId: cart._id, items, totals, itemCount: items.reduce((n, i) => n + i.quantity, 0) };
}

/**
 * Merge a guest cart (array of {productId, size, colour, quantity})
 * into the user's cart. Called once on login.
 * Validates stock for each line and clamps quantities.
 */
export async function mergeGuestCart(userId, guestItems = []) {
  if (!Array.isArray(guestItems) || guestItems.length === 0) return;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = new Cart({ user: userId, items: [] });

  for (const g of guestItems) {
    const qty = Math.max(1, Math.min(20, parseInt(g.quantity, 10) || 1));
    const product = await Product.findById(g.productId);
    if (!product || !product.isActive) continue;

    const variant = product.variants.find(
      (v) => v.size === g.size && v.colour === g.colour
    );
    if (!variant || variant.stock <= 0) continue;

    const existing = cart.items.find(
      (i) =>
        String(i.product) === String(product._id) &&
        i.size === g.size &&
        i.colour === g.colour
    );

    if (existing) {
      const max = Math.min(variant.stock, 20);
      existing.quantity = Math.min(max, existing.quantity + qty);
      existing.priceSnapshot = product.price;
    } else {
      const max = Math.min(variant.stock, 20);
      cart.items.push({
        product: product._id,
        size: g.size,
        colour: g.colour,
        quantity: Math.min(max, qty),
        priceSnapshot: product.price,
      });
    }
  }

  await cart.save();
}