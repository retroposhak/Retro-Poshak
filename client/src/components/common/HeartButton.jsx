import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';

export default function HeartButton({ productId, className = '' }) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(productId);

  const onClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = await toggle(productId);
    toast.success(added ? 'Saved to wishlist' : 'Removed from wishlist');
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      type="button"
      onClick={onClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`grid h-10 w-10 place-items-center rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md ${className}`}
    >
      <Heart
        size={18}
        className={active ? 'text-[#b33a3a]' : 'text-[#1A1715]/60'}
        fill={active ? '#b33a3a' : 'none'}
        strokeWidth={active ? 0 : 1.5}
      />
    </motion.button>
  );
}