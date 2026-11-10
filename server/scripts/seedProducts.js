import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { SIZES } from '../utils/constants.js';

const PRODUCTS = [
  {
    id: 1,
    name: "Khelo Cards",
    subtitle: "The rivalry that made us best friends.",
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Navy Blue", "Black"], 
    colorHex: { "Beige": "#e6d8c3", "Navy Blue": "#3b4a63", "Black": "#262220"},
    categories: ["doston-ki-baithak", "gali-cricket", "ready-set-bachpan"],
    description: "For every mohalla that turned into a stadium.",
    defaultLandingImage: "Black-2.png" 
  },
  {
    id: 2,
    name: "Barf Ka Gola",
    subtitle: "Filed from the field of every summer evening.",
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Navy Blue", "Black"],
    colorHex: { "Beige": "#e6d8c3", "Navy Blue": "#3b4a63", "Black": "#262220" },
    categories: ["gola-wale-ki-gali", "gali-cricket", "ready-set-bachpan"],
    description: "A tribute to the local grounds that hosted our greatest matches.",
    defaultLandingImage: "OffWhite-2.png"
  },
  {
    id: 3,
    name: "Cycle ka Safar",
    subtitle: "For every game that had a starting line.",
    price: 1299,
    compareAt: 1699,
    colors: ["Beige", "Navy Blue", "Black"],
    colorHex: { "Beige": "#e6d8c3", "Navy Blue": "#3b4a63", "Black": "#262220" },
    categories: ["ready-set-bachpan", "school-ka-vo-safar", "doston-ki-baithak", "gali-cricket"],
    description: "Oversized heavyweight tee with a nostalgic gully-cricket graphic.",
    defaultLandingImage: "Black-2.png"
  },
  {
    id: 4,
    name: "Car & Chai ki tapri",
    subtitle: "Conversations that fixed everything.",
    price: 1399,
    compareAt: 1799,
    colors: ["Beige", "Navy Blue", "Black"], 
    colorHex: { "Beige": "#e6d8c3", "Navy Blue": "#3b4a63", "Black": "#262220" },
    categories: ["ek-chai-hazaar-kisse", "woh-lambi-calls", "doston-ki-baithak", "woh-gaane-woh-din"],
    description: "A relaxed-fit tee with a nostalgic cutting-chai graphic.",
    defaultLandingImage: "OffWhite-1.png",
    // ADDED: Override the folder name for URL-safe requests
    folderName: "Car-and-Chai-ki-tapri" 
  }
];

const CATEGORIES = [
  { slug: 'gola-wale-ki-gali', label: 'Gola Wale Ki Gali', tagline: 'Summer, ice and colours', image: 'assets/images/shopbystory/golawalekigali.jpeg', order: 1 },
  { slug: 'school-ka-vo-safar', label: 'School Ka Vo Safar', tagline: 'Uniforms, tiffins, first friends', image: 'assets/images/shopbystory/schoolkavosafar.jpeg', order: 2 },
  { slug: 'doston-ki-baithak', label: 'Doston Ki Baithak', tagline: 'Where everything made sense', image: 'assets/images/shopbystory/dostonkibaithak.jpeg', order: 3 },
  { slug: 'ek-chai-hazaar-kisse', label: 'Ek Chai, Hazaar Kisse', tagline: 'Cutting chai, endless stories', image: 'assets/images/shopbystory/ekchaihazaarkisse.jpeg', order: 4 },
  { slug: 'woh-lambi-calls', label: 'Woh Lambi Calls', tagline: 'When conversations were longer', image: 'assets/images/shopbystory/wohlambicalls.jpeg', order: 5 },
  { slug: 'gali-cricket', label: 'Gali Cricket', tagline: 'The stadium was our street', image: 'assets/images/shopbystory/galicricket.jpeg', order: 6 },
  { slug: 'ready-set-bachpan', label: 'Ready, Set, Bachpan!', tagline: 'Playgrounds and endless energy', image: 'assets/images/shopbystory/readysetbachpan.jpeg', order: 7 },
  { slug: 'woh-gaane-woh-din', label: 'Woh Gaane, Woh Din', tagline: 'The soundtrack of our childhood', image: 'assets/images/shopbystory/wohgaanewohdin.jpeg', order: 8 },
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getFolderColorName(uiColor) {
  if (uiColor === 'Navy Blue') return 'Blue';
  if (uiColor === 'Beige') return 'OffWhite';
  return uiColor;
}

export async function seedProducts({ reset = true } = {}) {
  if (reset) {
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('[seed] Cleared products + categories');
  }

  await Category.insertMany(CATEGORIES);
  console.log(`[seed] Inserted ${CATEGORIES.length} categories`);

  const docs = PRODUCTS.map((p) => {
    const variants = [];
    const availableSizes = SIZES.filter((s) => s !== 'XS');
    
    for (const colour of p.colors) {
      for (const size of availableSizes) {
        variants.push({
          size,
          colour,
          stock: 8,
          sku: `${slugify(p.name)}-${colour.replace(/\s+/g, '').toLowerCase()}-${size}`,
        });
      }
    }

    const colorImages = {};
    // Use the safe folder name if provided, otherwise fallback to product name
    const safeFolderName = p.folderName || p.name;
    const baseFolder = `assets/images/products/${safeFolderName}/Website_Shop/`;
    
    p.colors.forEach((color) => {
      const folderColor = getFolderColorName(color);
      // All products now have 4 images
      const numImages = 4;
      
      const images = [];
      for (let i = 1; i <= numImages; i++) {
        images.push(`${baseFolder}${folderColor}-${i}.png`);
      }
      
      colorImages[color] = images;
    });

    const landingImagePath = p.defaultLandingImage 
      ? `${baseFolder}${p.defaultLandingImage}` 
      : (colorImages[p.colors[0]] || [])[0];

    return {
      name: p.name,
      slug: slugify(p.name),
      subtitle: p.subtitle,
      description: p.description,
      price: p.price,
      compareAt: p.compareAt,
      
      images: [landingImagePath], 
      heroImage: landingImagePath,
      colorImages, 
      
      colors: p.colors,
      colorHex: p.colorHex,
      sizes: availableSizes,
      variants,
      categories: p.categories,
      isFeatured: true,
      soldCount: 0,
    };
  });

  const inserted = await Product.insertMany(docs);
  console.log(`[seed] Inserted ${inserted.length} products`);
  
  inserted.forEach((p) => {
    console.log(`        · ${p.name} — Main Image: ${p.images[0]}`);
  });

  return { products: inserted.length, categories: CATEGORIES.length };
}