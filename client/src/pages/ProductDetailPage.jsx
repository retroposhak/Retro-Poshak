import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, ShoppingBag, Minus, Plus, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import ProductGallery from '../components/products/ProductGallery';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { reviewService } from '../services/reviewService';
import { formatINR } from '../utils/formatCurrency';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  const [size, setSize] = useState('');
  const [colour, setColour] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [postingReview, setPostingReview] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    productService
      .get(slug)
      .then((res) => {
        if (!alive) return;
        setProduct(res.product);
        setRelated(res.related);
        
        const defaultColor = res.product.colors?.[0] || '';
        setColour(defaultColor);
        
        // Set default active image
        const defaultImages = res.product.colorImages?.[defaultColor] || res.product.images || [];
        setActiveImage(defaultImages[0] || '');
        
        setSize(res.product.sizes?.includes('M') ? 'M' : res.product.sizes?.[0] || '');
      })
      .catch((e) => {
        if (alive) {
          toast.error('Product not found');
          navigate('/shop', { replace: true });
        }
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug, navigate]);

  useEffect(() => {
    if (product?.id) {
      reviewService.list(product.id).then(setReviews).catch(() => {});
    }
  }, [product?.id]);

  const stockFor = useMemo(() => {
    if (!product) return 0;
    const v = product.variants.find((v) => v.size === size && v.colour === colour);
    return v?.stock ?? 0;
  }, [product, size, colour]);

  // Determine which gallery images to show based on the selected color
  const currentGallery = useMemo(() => {
    if (!product) return [];
    return product.colorImages?.[colour] || product.images || [];
  }, [product, colour]);

  const handleColorSelect = (newColor) => {
    setColour(newColor);
    
    // Get the specific images for the newly selected color
    const newImages = product.colorImages?.[newColor] || product.images || [];
    
    // Set the main image to the first image of the new color
    setActiveImage(newImages[0] || '');
  };

  const addToBag = async () => {
    if (!product) return;
    if (!size || !colour) { toast.error('Choose a size and colour'); return; }
    if (stockFor <= 0) { toast.error('Out of stock'); return; }
    setAdding(true);
    try {
      await add({ product, size, colour, quantity });
      toast.success('Added to bag');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Could not add to bag');
    } finally {
      setAdding(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setPostingReview(true);
    try {
      const r = await reviewService.create(product.id, reviewForm);
      setReviews((prev) => [r, ...prev]);
      setReviewForm({ rating: 5, title: '', body: '' });
      toast.success('Review posted — thank you!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not post review');
    } finally {
      setPostingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#F7F3EC] min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 grid gap-12 lg:grid-cols-2 animate-pulse">
          <div className="aspect-[3/4] bg-[#EBE4D8] rounded-3xl" />
          <div className="space-y-6 pt-10">
            <div className="h-10 w-2/3 bg-[#EBE4D8] rounded-full" />
            <div className="h-4 w-1/3 bg-[#EBE4D8] rounded-full" />
            <div className="h-6 w-1/4 bg-[#EBE4D8] rounded-full" />
            <div className="h-32 w-full bg-[#EBE4D8] rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) return null;
  const wishlisted = isWishlisted(product.id);

  return (
    <main className="bg-[#F7F3EC] min-h-screen pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-cond tracking-[0.15em] uppercase text-[#1A1715]/50 hover:text-[#1A1715] transition-colors">
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16 xl:gap-24">
          
          {/* LEFT: IMAGE GALLERY */}
          <ProductGallery images={currentGallery} activeImage={activeImage} setActiveImage={setActiveImage} />

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col pt-2 lg:pt-6">
            
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#b33a3a] mb-3">
              Retro Poshak
            </span>
            
            <div className="flex justify-between items-start gap-4">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#1A1715] leading-[0.95] tracking-tight"
              >
                {product.name}
              </motion.h1>
              <button 
                onClick={() => { toggle(product.id); toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist'); }}
                className={`mt-2 h-11 w-11 flex items-center justify-center rounded-full border transition-all shrink-0 ${wishlisted ? 'border-[#b33a3a] bg-[#b33a3a]/10 text-[#b33a3a]' : 'border-[#1A1715]/10 hover:border-[#b33a3a] text-[#1A1715]/60 hover:text-[#b33a3a]'}`}
              >
                <Heart size={18} fill={wishlisted ? '#b33a3a' : 'none'} />
              </button>
            </div>

            {product.subtitle && (
              <p className="mt-4 font-serif italic text-2xl md:text-3xl text-[#1A1715]/50">
                {product.subtitle}
              </p>
            )}

            <div className="mt-6 flex items-baseline gap-4">
              <span className="font-serif text-4xl text-[#1A1715]">{formatINR(product.price)}</span>
              {product.compareAt > product.price && (
                <span className="text-xl text-[#1A1715]/40 line-through">
                  {formatINR(product.compareAt)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-6 text-sm leading-relaxed text-[#1A1715]/60 font-sans max-w-md">
                {product.description}
              </p>
            )}

            <div className="my-8 h-px w-full bg-[#1A1715]/10" />

            {/* Colour Selection */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1715] mb-4">
                Colour — <span className="text-[#1A1715]/50">{colour}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleColorSelect(c)}
                    title={c}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                      colour === c ? 'border-[#1A1715] scale-110 shadow-lg' : 'border-transparent hover:scale-105 shadow-sm'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-full shadow-inner" style={{ background: product.colorHex?.[c] || '#ccc' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-8">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1715]">Size</h3>
                {stockFor > 0 && stockFor <= 5 && (
                  <span className="text-[10px] font-cond tracking-wider uppercase text-[#b33a3a]">Only {stockFor} left</span>
                )}
                {stockFor === 0 && (
                  <span className="text-[10px] font-cond tracking-wider uppercase text-[#1A1715]/40">Out of stock</span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((s) => {
                  const v = product.variants.find((v) => v.size === s && v.colour === colour);
                  const out = !v || v.stock <= 0;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      disabled={out}
                      className={`h-12 min-w-[56px] rounded-full px-4 text-sm font-medium transition-all ${
                        size === s
                          ? 'bg-[#1A1715] text-[#F7F3EC] border border-[#1A1715] shadow-md'
                          : out
                          ? 'border border-[#1A1715]/10 text-[#1A1715]/20 line-through cursor-not-allowed'
                          : 'border border-[#1A1715]/20 text-[#1A1715] hover:border-[#1A1715]'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Add to Bag */}
            <div className="mt-10 flex gap-4">
              <div className="flex items-center border border-[#1A1715]/20 h-14 bg-transparent rounded-full overflow-hidden px-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-full flex items-center justify-center text-[#1A1715]/50 hover:text-[#1A1715] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(stockFor, q + 1))}
                  className="w-10 h-full flex items-center justify-center text-[#1A1715]/50 hover:text-[#1A1715] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={addToBag}
                disabled={adding || stockFor <= 0}
                className="flex-1 h-14 bg-[#1A1715] text-[#F7F3EC] text-xs font-bold tracking-[0.2em] uppercase rounded-full hover:bg-[#b33a3a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {stockFor <= 0 ? 'Out of Stock' : adding ? 'Adding...' : <><ShoppingBag size={16} /> Add to Bag</>}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-2 gap-4 text-xs text-[#1A1715]/50 font-sans border-t border-[#1A1715]/10 pt-8">
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#C8A97E]" /> 240 GSM Heavyweight</div>
              <div className="flex items-center gap-2"><Truck size={16} className="text-[#C8A97E]" /> Free shipping above ₹1,499</div>
              <div className="flex items-center gap-2"><RefreshCw size={16} className="text-[#C8A97E]" /> 7-Day Returns</div>
              <div className="flex items-center gap-2"><ShoppingBag size={16} className="text-[#C8A97E]" /> COD Available</div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS - Updated to pass active colour */}
        {related.length > 0 && (
          <section className="mt-24 pt-16 border-t border-[#1A1715]/10">
            <h2 className="mb-8 font-serif text-3xl text-[#1A1715]">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} activeColors={[colour]} />
              ))}
            </div>
          </section>
        )}

        {/* REVIEWS */}
        <section className="mt-24 max-w-4xl border-t border-[#1A1715]/10 pt-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-3xl text-[#1A1715]">Reviews</h2>
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex text-[#C8A97E]"><Star size={16} fill="currentColor"/></div>
                <span className="font-medium text-sm">{product.rating} / 5</span>
                <span className="text-sm text-[#1A1715]/50">({product.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <form onSubmit={submitReview} className="bg-[#EBE4D8]/40 p-6 sm:p-8 mb-12 rounded-3xl">
              <h3 className="font-serif text-xl mb-4">Share your thoughts</h3>
              
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                    className={`text-2xl transition-colors ${n <= reviewForm.rating ? 'text-[#C8A97E]' : 'text-[#1A1715]/20 hover:text-[#1A1715]/40'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              
              <input
                placeholder="Title (optional)"
                value={reviewForm.title}
                onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full bg-transparent border-b border-[#1A1715]/20 px-0 py-3 text-sm outline-none focus:border-[#1A1715] mb-4 placeholder:text-[#1A1715]/40"
              />
              <textarea
                placeholder="Your review..."
                value={reviewForm.body}
                onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                rows={3}
                className="w-full bg-transparent border border-[#1A1715]/20 p-4 text-sm outline-none focus:border-[#1A1715] mb-4 placeholder:text-[#1A1715]/40 resize-none rounded-xl"
              />
              <button disabled={postingReview} className="bg-[#1A1715] text-[#F7F3EC] text-xs font-bold tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#b33a3a] transition-colors disabled:opacity-50">
                {postingReview ? 'Posting...' : 'Post Review'}
              </button>
            </form>
          )}

          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-[#1A1715]/10 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-serif text-lg text-[#1A1715]">{r.userName}</p>
                  <p className="text-[#C8A97E]">{'★'.repeat(r.rating)}</p>
                </div>
                {r.title && <p className="font-medium text-sm mb-1">{r.title}</p>}
                {r.body && <p className="text-[#1A1715]/70 text-sm leading-relaxed mb-3">{r.body}</p>}
                <p className="text-xs text-[#1A1715]/40 font-sans">
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))}
            {reviews.length === 0 && !isAuthenticated && (
              <p className="text-sm text-[#1A1715]/50 italic">No reviews yet. Login to be the first.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}