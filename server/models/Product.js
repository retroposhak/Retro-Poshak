import mongoose from 'mongoose';
import { COLLECTIONS, COLOR_HEX, SIZES } from '../utils/constants.js';

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, enum: SIZES, required: true },
    colour: { type: String, required: true },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, default: '' },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    // Display
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },

    // Pricing (all in ₹, integer paise avoided for INR whole-rupee products)
    price: { type: Number, required: true, min: 0 },
    compareAt: { type: Number, default: 0, min: 0 },

    // Media
    images: { type: [String], default: [] },
    heroImage: { type: String, default: '' },
    
    // NEW: Map colors to specific images
    colorImages: { type: Map, of: [String], default: {} },

    // Variants
    colors: { type: [String], default: [] },
    colorHex: { type: Map, of: String, default: {} },
    sizes: { type: [String], enum: SIZES, default: ['S', 'M', 'L', 'XL', 'XXL'] },
    variants: { type: [variantSchema], default: [] },

    // Story / merchandising
    categories: {
      type: [{ type: String, enum: COLLECTIONS }],
      default: [],
    },
    tags: { type: [String], default: [] },

    // Aggregates
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },

    // State
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Helpers
productSchema.virtual('stock').get(function () {
  return this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
});

productSchema.virtual('inStock').get(function () {
  return this.variants.some((v) => v.stock > 0);
});

productSchema.methods.hexFor = function (colour) {
  if (this.colorHex instanceof Map) return this.colorHex.get(colour) || COLOR_HEX[colour] || '#cccccc';
  return this.colorHex?.[colour] || COLOR_HEX[colour] || '#cccccc';
};

// Indexes
productSchema.index({ name: 'text', subtitle: 'text', description: 'text', tags: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ isFeatured: 1, soldCount: -1 });
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model('Product', productSchema);