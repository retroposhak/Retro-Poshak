import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EmptyState({ icon = '🛍️', title, description, ctaLabel, ctaHref }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center bg-[#FCFAF5] border border-[#1A1715]/5 rounded-[32px] shadow-sm max-w-2xl mx-auto"
    >
      {/* Floating Icon */}
      <motion.div 
        animate={{ y: [0, -8, 0] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="text-6xl mb-6 drop-shadow-md"
      >
        {typeof icon === 'string' ? icon : icon}
      </motion.div>

      <h3 className="font-serif text-3xl text-[#1A1715]">{title}</h3>
      
      {description && (
        <p className="mt-3 max-w-md text-sm text-[#1A1715]/60 font-sans leading-relaxed">
          {description}
        </p>
      )}

      {ctaLabel && ctaHref && (
        <Link 
          to={ctaHref} 
          className="mt-8 inline-flex items-center justify-center bg-[#1A1715] text-[#F7F3EC] px-8 py-4 text-xs font-bold tracking-[0.15em] uppercase rounded-full hover:bg-[#b33a3a] transition-colors duration-300 shadow-md group"
        >
          {ctaLabel}
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      )}
    </motion.div>
  );
}