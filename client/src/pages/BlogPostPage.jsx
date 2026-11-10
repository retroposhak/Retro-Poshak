import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { postService } from '../services/postService';
import BlogBody from '../components/blog/BlogBody';
import BlogCard from '../components/blog/BlogCard';
import { ArrowLeft } from 'lucide-react';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  return formattedPath.replace(/ /g, '%20');
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Framer Motion scroll progress hook
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0); // Scroll to top on load
    postService.get(slug)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F3EC] pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b33a3a]"></div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#F7F3EC] pt-32 text-center">
        <h2 className="font-serif text-3xl text-[#1A1715]">Story not found</h2>
        <Link to="/blog" className="text-[#b33a3a] mt-4 inline-block hover:underline">Back to Blog</Link>
      </main>
    );
  }

  const { post, related } = data;

  return (
    <main className="bg-[#F7F3EC] min-h-screen pb-24">
      
      {/* Animated Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#b33a3a] origin-left"
        style={{ scaleX }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-cond tracking-[0.15em] uppercase text-[#1A1715]/50 hover:text-[#b33a3a] transition-colors mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Stories
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block px-3 py-1 bg-[#b33a3a] text-[#F7F3EC] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            {post.categoryLabel}
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1A1715] leading-[1.1] tracking-tight mb-6">
            {post.title}
          </h1>
          
          <p className="text-lg md:text-xl text-[#1A1715]/70 font-serif italic max-w-2xl mx-auto mb-8">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-center gap-3 text-xs font-cond tracking-wide uppercase text-[#1A1715]/50">
            <span>{new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>•</span>
            <span>{post.readTimeMinutes} min read</span>
            <span>•</span>
            <span>By {post.authorName}</span>
          </div>
        </motion.div>

        {/* Hero Image */}
        {post.coverImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full aspect-[16/9] object-cover"
            />
          </motion.div>
        )}

        {/* Article Content with reveal animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <BlogBody blocks={post.content} />
        </motion.div>

        {/* CTA Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-10 rounded-3xl bg-[#EBE4D8]/60 border border-[#1A1715]/5 text-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C8A97E]/20 rounded-full blur-3xl" />
          <p className="font-script text-4xl text-[#b33a3a] mb-4 relative z-10">Wear your yaaden.</p>
          <p className="text-sm text-[#1A1715]/60 mb-8 max-w-md mx-auto">Discover our collection of premium oversized tees inspired by real Indian nostalgia.</p>
          <Link to="/shop" className="inline-flex items-center justify-center bg-[#1A1715] text-[#F7F3EC] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#b33a3a] transition-all duration-300 relative z-10">
            Shop the Collection
          </Link>
        </motion.div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-[#1A1715]/10">
          <h2 className="font-serif text-3xl text-[#1A1715] mb-10 text-center">Keep Reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <BlogCard key={p.id} post={{ ...p, excerpt: '' }} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}