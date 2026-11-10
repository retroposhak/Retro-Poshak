import { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';
import { formatINR } from '../../utils/formatCurrency';

// Safely encode paths for URLs, handling spaces and special chars like '&'
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  try {
    return encodeURI(formattedPath);
  } catch {
    return formattedPath.replace(/ /g, '%20');
  }
};

export default function ProductCard({ product, activeColors = [] }) {
  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const timer = useRef(null);
  const { isWishlisted, toggle } = useWishlist();

  const wishlisted = isWishlisted(product.id);

  // Determine which images to cycle through based on active filter
  const displayImages = useMemo(() => {
    // If a color is actively filtered, show that color's images
    if (activeColors.length > 0) {
      const matchingColor = product.colors?.find((c) => activeColors.includes(c));
      if (matchingColor && product.colorImages?.[matchingColor]) {
        return product.colorImages[matchingColor];
      }
    }
    // Otherwise, cycle through the default images. 
    // We can safely fall back to the full list of images for the first color.
    return product.colorImages?.[product.colors?.[0]] || product.images || [];
  }, [product, activeColors]);

  const startCycle = () => {
    setHovered(true);
    if (!displayImages || displayImages.length < 2) return;
    let i = 0;
    timer.current = setInterval(() => {
      i = (i + 1) % displayImages.length;
      setImgIdx(i);
    }, 1500);
  };

  const stopCycle = () => {
    setHovered(false);
    clearInterval(timer.current);
    setImgIdx(0);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  // Use the explicitly set default image (heroImage) as the base, or the first image in the current cycle
  const displayImg = getImageUrl(
    (imgIdx === 0 ? product.heroImage : null) || 
    displayImages[imgIdx] || 
    product.heroImage
  );

  // Reset image index if the filter changes
  useEffect(() => {
    setImgIdx(0);
  }, [displayImages]);

  return (
    <Link 
      to={`/shop/${product.slug}`} 
      className="group block relative"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      {/* ═══════════ IMAGE CONTAINER ═══════════ */}
      <div className="relative aspect-[3/4] bg-[#EBE4D8] overflow-hidden mb-5 shadow-sm">
        
        {/* Main Image with smooth fade transition */}
        {displayImg ? (
          <motion.img
            key={displayImg}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            src={displayImg}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-1000 ease-out ${hovered ? 'scale-110' : 'scale-100'}`}
            onError={(e) => { 
              e.target.style.display = 'none'; 
              e.target.parentElement.classList.add('bg-cream-200');
            }}
          />
        ) : (
          <div className="h-full w-full bg-[#EBE4D8]" />
        )}

        {/* Dark Overlay for better button visibility */}
        <div className={`absolute inset-0 bg-black/0 transition-colors duration-500 pointer-events-none ${hovered ? 'bg-black/5' : ''}`} />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 h-9 w-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:scale-110 text-[#1A1715] transition-all z-10 shadow-md"
        >
          <Heart size={16} fill={wishlisted ? '#b33a3a' : 'none'} stroke={wishlisted ? '#b33a3a' : 'currentColor'} />
        </button>

        {/* Quick Add Button (Slides up on hover) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toast.success('Select size to add to bag');
          }}
          className={`absolute bottom-3 right-3 h-10 w-10 bg-[#1A1715] backdrop-blur-sm rounded-full flex items-center justify-center text-[#F7F3EC] transition-all duration-500 ease-out z-10 hover:bg-[#b33a3a] hover:scale-110 shadow-lg ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <ShoppingBag size={16} />
        </button>
      </div>

      {/* ═══════════ PRODUCT INFO ═══════════ */}
      <div className="px-1 relative">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-serif text-xl text-[#1A1715] group-hover:text-[#b33a3a] transition-colors leading-tight">
            {product.name}
          </h3>
        </div>
        
        {product.subtitle && (
          <p className="mt-1.5 text-xs text-[#1A1715]/60 line-clamp-1">
            {product.subtitle}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium tracking-wide text-[#1A1715]">
              {formatINR(product.price)}
            </span>
            {product.compareAt > product.price && (
              <span className="text-xs text-[#1A1715]/40 line-through">
                {formatINR(product.compareAt)}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.colors?.length > 0 && (
            <div className="flex gap-1.5">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="h-3 w-3 rounded-full border border-[#1A1715]/10 shadow-sm transition-transform hover:scale-125 cursor-help"
                  style={{ background: product.colorHex?.[c] || '#ccc' }}
                  title={c}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}