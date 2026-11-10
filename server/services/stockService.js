import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Decrement stock for an order's items. Throws if any line lacks stock.
 * On error, restores any lines that were already decremented.
 *
 * NOTE: variant subdocuments don't support atomic per-line updates easily
 * with a single query, so we do it in-process — safe enough for this scale.
 * If you scale to thousands of concurrent checkouts, migrate variants to
 * their own collection with findOneAndUpdate({ $inc }).
 */
export async function reserveStock(items) {
  const applied = []; // { productId, size, colour, quantity }

  try {
    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product || !product.isActive) {
        throw ApiError.badRequest(`Product no longer available: ${it.name}`);
      }
      const variant = product.variants.find(
        (v) => v.size === it.size && v.colour === it.colour
      );
      if (!variant) {
        throw ApiError.badRequest(`${it.name} — ${it.size}/${it.colour} not found`);
      }
      if (variant.stock < it.quantity) {
        throw ApiError.badRequest(`Not enough stock for ${it.name}`);
      }
      variant.stock -= it.quantity;
      await product.save();
      applied.push({
        productId: it.productId,
        size: it.size,
        colour: it.colour,
        quantity: it.quantity,
      });
    }
  } catch (err) {
    // Rollback any partial decrements
    for (const a of applied) {
      const product = await Product.findById(a.productId);
      const variant = product?.variants.find(
        (v) => v.size === a.size && v.colour === a.colour
      );
      if (variant) {
        variant.stock += a.quantity;
        await product.save();
      }
    }
    throw err;
  }
}

/**
 * Restore stock (used when an order is cancelled or payment fails).
 */
export async function restoreStock(items) {
  for (const it of items) {
    const product = await Product.findById(it.productId);
    if (!product) continue;
    const variant = product.variants.find(
      (v) => v.size === it.size && v.colour === it.colour
    );
    if (variant) {
      variant.stock += it.quantity;
      await product.save();
    }
  }
}