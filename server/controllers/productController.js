import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listProducts = asyncHandler(async (req, res) => {
  const {
    q = '',
    category = '',
    colors = '',
    minPrice,
    maxPrice,
    sort = 'featured',
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isActive: true };

  if (q.trim()) {
    filter.$text = { $search: q.trim() };
  }
  if (category) filter.categories = category;

  const colorList = colors.split(',').map((c) => c.trim()).filter(Boolean);
  if (colorList.length) filter.colors = { $in: colorList };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    featured: { isFeatured: -1, soldCount: -1, createdAt: -1 },
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    name: { name: 1 },
    newest: { createdAt: -1 },
  };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort] || sortMap.featured).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    items: items.map(serializeProduct),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { slugOrId } = req.params;
  const product = slugOrId.match(/^[a-f0-9]{24}$/i)
    ? await Product.findById(slugOrId)
    : await Product.findOne({ slug: slugOrId });

  if (!product || !product.isActive) throw ApiError.notFound('Product not found');

  const related = await Product.find({
    _id: { $ne: product._id },
    categories: { $in: product.categories },
    isActive: true,
  })
    .limit(4)
    .sort({ isFeatured: -1, soldCount: -1 });

  res.json({
    success: true,
    product: serializeProduct(product),
    related: related.map(serializeProduct),
  });
});

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, categories });
});

function serializeProduct(p) {
  return {
    id: String(p._id),
    name: p.name,
    slug: p.slug,
    subtitle: p.subtitle,
    description: p.description,
    price: p.price,
    compareAt: p.compareAt,
    images: p.images,
    heroImage: p.heroImage,
    
    // NEW: Include colorImages
    colorImages: p.colorImages instanceof Map ? Object.fromEntries(p.colorImages) : p.colorImages,
    
    colors: p.colors,
    colorHex: p.colorHex instanceof Map ? Object.fromEntries(p.colorHex) : p.colorHex,
    sizes: p.sizes,
    categories: p.categories,
    rating: p.rating,
    reviewCount: p.reviewCount,
    variants: p.variants.map((v) => ({
      size: v.size,
      colour: v.colour,
      stock: v.stock,
    })),
    inStock: p.variants.some((v) => v.stock > 0),
    createdAt: p.createdAt,
  };
}