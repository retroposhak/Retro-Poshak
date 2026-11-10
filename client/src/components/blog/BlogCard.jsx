import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  return formattedPath.replace(/ /g, '%20');
};

export default function BlogCard({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full" // Ensure the motion wrapper takes full height
    >
      <Link 
        to={`/blog/${post.slug}`} 
        className="group flex flex-col h-full bg-[#FCFAF5] border border-[#1A1715]/10 hover:shadow-2xl transition-all duration-500 overflow-hidden"
      >
        {/* Image Container - Fixed Aspect Ratio */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EBE4D8] shrink-0">
          <img
            src={getImageUrl(post.coverImage)}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            onError={(e) => { e.target.style.display='none'; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>

        {/* Content Container - Flex 1 to fill remaining space */}
        <div className="flex flex-col flex-1 p-6 relative">
          {/* Date Ribbon */}
          <div className="absolute -top-3 left-6 bg-[#FCFAF5] px-3 py-1 text-[10px] font-cond font-bold tracking-[0.15em] text-[#1A1715]/50 uppercase border border-[#1A1715]/5 shadow-sm group-hover:text-[#b33a3a] transition-colors">
            {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
          </div>

          {/* Category */}
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1715]/60 mb-3 block mt-2">
            {post.categoryLabel}
          </span>

          {/* Title - Line Clamped to ensure consistency */}
          <h3 className="font-serif text-xl lg:text-2xl text-[#1A1715] leading-[1.2] group-hover:text-[#b33a3a] transition-colors mb-3 line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt - Line Clamped to ensure consistency */}
          <p className="text-sm text-[#1A1715]/70 leading-relaxed mb-6 line-clamp-3 font-sans">
            {post.excerpt}
          </p>

          {/* Read More - Pushed to bottom using mt-auto */}
          <div className="mt-auto pt-4 border-t border-[#1A1715]/5">
            <span className="font-script text-2xl text-[#b33a3a] group-hover:text-[#1A1715] transition-colors flex items-center gap-2">
              Read More <span className="text-xl leading-none transform group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}