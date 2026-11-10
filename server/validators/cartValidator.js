import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product id'),
  size: z.string().trim().min(1),
  colour: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(20).default(1),
});

export const updateCartSchema = z.object({
  lineIndex: z.number().int().min(0),
  quantity: z.number().int().min(1).max(20),
});

export const removeCartSchema = z.object({
  lineIndex: z.number().int().min(0),
});

export const mergeCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
        size: z.string().min(1),
        colour: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .max(50),
});

export const wishlistAddSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});