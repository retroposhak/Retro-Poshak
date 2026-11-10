import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import EmptyState from '../components/common/EmptyState';

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    productService
      .list({ limit: 48 })
      .then(({ items }) => {
        if (alive) setProducts(items.filter((p) => ids.includes(p.id)));
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [ids]);

  return (
    <main className="bg-[#F7F3EC] min-h-screen py-16">
      <div className="container-page">
        
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-[#1A1715]/50 hover:text-[#b33a3a] transition-colors mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1A1715]/10 pb-8 mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#b33a3a] block mb-3">
              Saved for later
            </span>
            <h1 className="font-serif text-5xl md:text-6xl text-[#1A1715]">
              Wishlist<span className="text-[#b33a3a]">.</span>
            </h1>
          </div>
          <p className="text-sm font-sans text-[#1A1715]/50">
            {ids.length === 0 
              ? 'Your favourite stories, all in one place.' 
              : `${ids.length} ${ids.length === 1 ? 'story' : 'stories'} saved.`}
          </p>
        </div>

        {!loading && products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="py-12"
          >
            <EmptyState
              icon={<Heart size={48} className="text-[#b33a3a]/30 mx-auto mb-4" />}
              title="Your wishlist is empty"
              description="Save your favourite stories and come back to them anytime."
              ctaLabel="Explore the Collection"
              ctaHref="/shop"
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGrid products={products} loading={loading} />
          </motion.div>
        )}
      </div>
    </main>
  );
}