import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingBag, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// Hero Carousel Data
// Ensure you have these images generated in your assets folder
const HERO_SLIDES = [
  {
    id: 1,
    title: 'CYCLE KA SAFAR',
    subtitle: 'For every game that had a starting line.',
    imgDesktop: 'assets/images/products/Cycle ka Safar/CycleKaSafar_Hero_Desktop.jpg',
    imgTablet: 'assets/images/products/Cycle ka Safar/CycleKaSafar_Hero_Tablet.jpg',
    imgMobile: 'assets/images/products/Cycle ka Safar/CycleKaSafar_Hero_Mobile.jpg',
    img: 'assets/images/products/Cycle ka Safar/CycleKaSafar_Hero.jpeg',
  },
  {
    id: 2,
    title: 'KHELO CARDS',
    subtitle: 'The rivalry that made us best friends.',
    imgDesktop: 'assets/images/products/Khelo Cards/KheloCards_Hero_Desktop.jpg',
    imgTablet: 'assets/images/products/Khelo Cards/KheloCards_Hero_Tablet.jpg',
    imgMobile: 'assets/images/products/Khelo Cards/KheloCards_Hero_Mobile.jpg',
    img: 'assets/images/products/Khelo Cards/KheloCards_Hero.jpeg',
  },
  {
    id: 3,
    title: 'CHAI KI TAPRI',
    subtitle: 'Conversations that fixed everything.',
    imgDesktop: 'assets/images/products/Chai ki Tapri/ChaiKiTapri_Hero_Desktop.png',
    imgTablet: 'assets/images/products/Chai ki Tapri/ChaiKiTapri_Hero_Tablet.png',
    imgMobile: 'assets/images/products/Chai ki Tapri/ChaiKiTapri_Hero_Mobile.png',
    img: 'assets/images/products/Chai ki Tapri/ChaiKiTapri_Hero.png',
  },
  {
    id: 4,
    title: 'BARF KA GOLA',
    subtitle: 'Filed from the field of every summer evening.',
    imgDesktop: 'assets/images/products/Barf Ka Gola/BarfKaGola_Hero_Desktop.png',
    imgTablet: 'assets/images/products/Barf Ka Gola/BarfKaGola_Hero_Tablet.png',
    imgMobile: 'assets/images/products/Barf Ka Gola/BarfKaGola_Hero_Mobile.png',
    img: 'assets/images/products/Barf Ka Gola/BarfKaGola_Hero.png',
  }
];

// Utility to safely format paths from the database
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path.replace(/ /g, '%20');
};

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live products from the Database
  useEffect(() => {
    let alive = true;
    productService.list({ limit: 4 })
      .then((res) => {
        if (alive) {
          const sorted = res.items.sort((a, b) => a.name.localeCompare(b.name));
          setProducts(sorted);
        }
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  // Extract all images from products for the community carousel
  const communityImages = products.flatMap(p => p.images).slice(0, 12);
  // Duplicate images to create a seamless infinite loop
  const marqueeImages = [...communityImages, ...communityImages, ...communityImages];

  return (
    <div 
      className="text-[#1A1715] overflow-x-hidden font-sans min-h-screen relative bg-[#F7F3EC] w-full"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
      }}
    >
      {/* Subtle Global Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.04] mix-blend-multiply" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rice-paper-3.png")' }} />

      {/* ═══════════ HERO SECTION (Full Bleed Image with Content on Top) ═══════════ */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-[#1A1715]">
        
        {/* BACKGROUND IMAGE LAYER */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-0 w-full h-full"
          >
            {/* 
              ART DIRECTION: 
              Loads specific images based on screen size.
              object-cover ensures the image completely fills the section.
            */}
            <picture className="w-full h-full">
              <source media="(min-width: 1024px)" srcSet={getImageUrl(HERO_SLIDES[currentSlide].imgDesktop)} />
              <source media="(min-width: 640px)" srcSet={getImageUrl(HERO_SLIDES[currentSlide].imgTablet)} />
              <img 
                src={getImageUrl(HERO_SLIDES[currentSlide].imgMobile || HERO_SLIDES[currentSlide].img)} 
                alt={HERO_SLIDES[currentSlide].title} 
                className="w-full h-full object-cover object-center"
              />
            </picture>
            
            {/* Gradient Overlays for text legibility */}
            {/* Mobile: Heavy bottom gradient | Desktop: Left-to-right gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1715] via-[#1A1715]/70 to-transparent lg:bg-gradient-to-r lg:from-[#1A1715] lg:via-[#1A1715]/70 lg:to-transparent" />
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
          </motion.div>
        </AnimatePresence>

        {/* CONTENT LAYER (Text, Buttons) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl text-center lg:text-left flex flex-col items-center lg:items-start mx-auto lg:mx-0">
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[70px] sm:text-[100px] md:text-[120px] lg:text-[160px] leading-[0.85] text-[#F7F3EC] tracking-tight drop-shadow-2xl"
            >
              PEHNO<br/>YAADEN.
            </motion.h1>

            <div className="min-h-[4rem] lg:min-h-[5rem] mt-4 lg:mt-6 flex justify-center lg:justify-start">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={currentSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#E8DCC4] drop-shadow-md text-center lg:text-left max-w-xs sm:max-w-sm lg:max-w-lg"
                >
                  "{HERO_SLIDES[currentSlide].subtitle}"
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-2 mt-6"
            >
              {['240 GSM', '100% Cotton', 'Oversized'].map((feature, i) => (
                <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-cond tracking-[0.15em] uppercase text-[#E8DCC4] shadow-sm">
                  {feature}
                </span>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
            >
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center w-full sm:w-auto gap-3 bg-[#F7F3EC] text-[#1A1715] font-cond tracking-[0.2em] uppercase text-xs px-10 py-4 lg:py-5 rounded-full hover:scale-[1.02] hover:bg-[#C8A97E] hover:text-white transition duration-500 group shadow-2xl"
              >
                Shop the Collection 
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
              
              <div className="flex gap-2.5">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 transition-all duration-500 rounded-full ${
                      currentSlide === idx ? 'w-8 lg:w-10 bg-[#C8A97E]' : 'w-2 bg-white/40 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Vintage Notes - Desktop Only */}
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [-4, -2, -4] }} 
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute bottom-16 right-16 bg-[#E8DCC4] p-6 max-w-[240px] shadow-2xl hidden lg:block border border-[#1A1715]/10 z-20"
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
          }}
        >
          <p className="font-script text-3xl text-[#1A1715] leading-tight text-center">
             Some memories<br/>never fade.
          </p>
        </motion.div>
      </section>

      {/* ═══════════ FEATURES MARQUEE ═══════════ */}
      <div className="border-y border-[#1A1715]/10 bg-[#F7F3EC]/90 backdrop-blur-md py-6 relative z-10 overflow-hidden w-full">
        <motion.div 
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex whitespace-nowrap gap-24 items-center w-max"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-24 items-center">
              <FeatureItem icon={<ShirtIcon />} title="240 GSM" desc="Heavyweight Fabric" />
              <FeatureItem icon={<LeafIcon />} title="100% Cotton" desc="Terry" />
              <FeatureItem icon={<FitIcon />} title="Oversized Fit" desc="Drop Shoulder" />
              <FeatureItem icon={<PrintIcon />} title="Premium Print" desc="Long Lasting" />
              <FeatureItem icon={<TruckIcon />} title="Free Shipping" desc="On orders above ₹1499" />
              <FeatureItem icon={<WalletIcon />} title="COD Available" desc="Across India" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* ═══════════ THE FIRST CHAPTER ═══════════ */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 w-full"
      >
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <span className="text-[11px] font-cond font-bold tracking-[0.3em] uppercase text-red">The First Chapter</span>
            <h2 className="font-serif text-5xl md:text-6xl text-[#1A1715] mt-3">Four stories. Countless memories.</h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
             <p className="text-sm text-[#1A1715]/60 max-w-[280px] md:text-right leading-relaxed font-light">
              Every design is a memory. A moment. A feeling from the days that made us.
            </p>
            <Link to="/shop" className="text-[11px] font-cond tracking-[0.2em] uppercase border-b border-[#1A1715] pb-1 hover:text-[#C8A97E] hover:border-[#C8A97E] transition group flex items-center gap-2 mt-2">
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#EBE4D8] mb-4"></div>
                <div className="h-4 bg-[#EBE4D8] w-2/3 mb-2"></div>
                <div className="h-3 bg-[#EBE4D8] w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {products.map((product) => (
              <ProductMockCard key={product.id} variants={fadeUp} product={product} />
            ))}
          </div>
        )}
      </motion.section>

      {/* ═══════════ LOOKBOOK ═══════════ */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="bg-[#EBE4D8]/50 py-24 border-y border-[#1A1715]/5 relative z-10 w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-sm">
              <span className="text-[11px] font-cond tracking-[0.3em] uppercase text-red block mb-3">Lookbook</span>
              <h2 className="font-serif text-5xl text-[#1A1715] leading-[1.1]">Same memories.<br/>Different styles.</h2>
              <p className="font-serif italic text-base text-[#1A1715]/60 mt-5 border-l-2 border-red/40 pl-4">
                Styled by you. Worn by us.
              </p>
            </div>
            <div className="hidden md:flex gap-3">
              <button className="h-12 w-12 border border-[#1A1715]/20 rounded-full flex items-center justify-center hover:bg-[#1A1715] hover:text-[#F7F3EC] transition-colors duration-300"><ArrowRight size={18} className="rotate-180" /></button>
              <button className="h-12 w-12 border border-[#1A1715]/20 rounded-full flex items-center justify-center hover:bg-[#1A1715] hover:text-[#F7F3EC] transition-colors duration-300"><ArrowRight size={18} /></button>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, idx) => (
              <LookbookCard 
                key={product.id} 
                variants={fadeUp} 
                img={product.images[idx % product.images.length]} 
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════ REVIEWS ═══════════ */}
      <section className="bg-[#F7F3EC] py-28 relative z-10 overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Left: Overall Rating */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <span className="text-[11px] font-cond tracking-[0.3em] uppercase text-red block mb-3">Loved by the Poshak Community</span>
              <div className="flex items-baseline gap-3 mt-2">
                <div className="flex text-[#C8A97E] text-xl">★★★★★</div>
                <span className="font-serif text-6xl text-[#1A1715]">4.8<span className="text-4xl text-[#1A1715]/40">/5</span></span>
              </div>
              <p className="font-serif italic text-base text-[#1A1715]/60 mt-5 border-l-2 border-red/40 pl-4">
                from 500+ happy customers
              </p>
            </motion.div>
            
            {/* Right: Review Cards */}
            {[
              { quote: "Premium quality and the print is just amazing. Feels like a piece of my childhood.", name: "Aman S." },
              { quote: "Perfect oversized fit and super comfortable. The design brings so many memories back.", name: "Neha K." },
              { quote: "Great fabric and print quality. Finally a brand that gets nostalgia right!", name: "Rohit M." }
            ].map((review, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative bg-[#FCFAF5] p-8 shadow-xl border border-[#1A1715]/5 mt-6 lg:mt-0"
              >
                {/* Masking Tape Decoration */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#EBE4D8]/90 backdrop-blur-sm shadow-sm rotate-1 mix-blend-multiply" />
                
                <div className="text-[#C8A97E] text-sm mb-4">★★★★★</div>
                <span className="absolute top-6 right-6 text-5xl font-serif text-[#1A1715]/10 leading-none">"</span>
                <p className="font-serif italic text-[#1A1715]/80 mb-8 leading-relaxed text-base">
                  {review.quote}
                </p>
                <div className="flex items-center gap-3 border-t border-[#1A1715]/10 pt-5">
                  <div className="h-10 w-10 rounded-full bg-[#EBE4D8] border border-[#1A1715]/10 flex items-center justify-center text-sm font-bold text-[#1A1715]/60">
                    {review.name.charAt(0)}
                  </div>
                  <p className="text-xs font-cond uppercase tracking-widest text-[#1A1715]/70">— {review.name}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ═══════════ AUTO-SCROLLING COMMUNITY CAROUSEL ═══════════ */}
          <div className="mt-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6 border-b border-[#1A1715]/10 pb-6"
            >
              <div>
                <span className="text-[11px] font-cond tracking-[0.3em] uppercase text-red block mb-3">Worn by the Poshak Community</span>
                <p className="font-serif text-3xl text-[#1A1715]">
                  Tag us <strong className="font-sans not-italic font-semibold text-xl">@retro_poshak</strong>
                </p>
              </div>
            </motion.div>

            {/* Infinite Auto-scroll wrapper */}
            <div className="relative w-full overflow-hidden py-10">
              <motion.div 
                className="flex gap-6 w-max"
                animate={{ x: ["0%", "-33.33%"] }}
                transition={{ 
                  repeat: Infinity, 
                  ease: "linear", 
                  duration: 30 
                }}
              >
                {marqueeImages.map((img, i) => (
                  <div 
                    key={i}
                    className="relative w-56 md:w-64 shrink-0 bg-white p-4 pb-10 shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Masking Tape Decoration */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#E8DCC4]/90 backdrop-blur-sm mix-blend-multiply rotate-2 z-10 shadow-sm" />
                    
                    <div className="aspect-square overflow-hidden bg-[#EBE4D8]">
                      <img 
                        src={getImageUrl(img)} 
                        alt="Community" 
                        className="w-full h-full object-cover grayscale-[20%] transition duration-700 group-hover:grayscale-0 group-hover:scale-105" 
                      />
                    </div>
                    <p className="absolute bottom-4 left-0 w-full text-center font-script text-2xl text-[#1A1715]/60">
                      yaadein
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Subcomponents ──

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4 mx-4">
      <div className="text-[#C8A97E]">{icon}</div>
      <div>
        <p className="text-xs font-cond uppercase tracking-[0.15em] font-bold text-[#1A1715]">{title}</p>
        <p className="text-[11px] text-[#1A1715]/60 font-light mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function ProductMockCard({ variants, product }) {
  const [hovered, setHovered] = useState(false);
  const { add } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  const wishlisted = isWishlisted(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product.id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await add({ 
        product, 
        size: 'M', 
        colour: product.colors?.[0] || 'Beige', 
        quantity: 1 
      });
      toast.success('Added to bag');
    } catch (err) {
      toast.error('Could not add to bag');
    }
  };

  const primaryImg = getImageUrl(product.images?.[0] || product.heroImage);
  const hoverImg = getImageUrl(product.images?.[2] || product.images?.[1] || primaryImg);

  return (
    <motion.div variants={variants}>
      <Link to={`/shop/${product.slug}`} className="group block" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="relative aspect-[3/4] bg-[#EBE4D8] overflow-hidden mb-5 shadow-sm">
          <motion.img 
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            src={hovered ? hoverImg : primaryImg} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
          
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlist}
            className="absolute top-4 right-4 h-9 w-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white text-[#1A1715] transition z-10 shadow-md"
          >
            <Heart size={16} fill={wishlisted ? '#b33a3a' : 'none'} stroke={wishlisted ? '#b33a3a' : 'currentColor'} />
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 h-9 w-9 bg-[#1A1715]/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#F7F3EC] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 hover:bg-[#1A1715] z-10 shadow-md"
          >
            <ShoppingBag size={16} />
          </motion.button>
        </div>
        
        <h3 className="font-serif text-xl text-[#1A1715] group-hover:text-red transition-colors">{product.name}</h3>
        <p className="text-xs text-[#1A1715]/60 mt-1.5 line-clamp-1">{product.subtitle}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm font-medium tracking-wide">₹{product.price?.toLocaleString('en-IN')}</span>
          <div className="flex gap-2">
            {product.colors?.slice(0, 3).map((color, idx) => (
              <span key={idx} className="h-3.5 w-3.5 rounded-full border border-[#1A1715]/20 shadow-sm" style={{ backgroundColor: product.colorHex?.[color] || '#ccc' }}></span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function LookbookCard({ variants, img }) {
  return (
    <motion.div variants={variants} whileHover={{ y: -8 }} className="relative group">
      <div className="relative aspect-[3/4] overflow-hidden shadow-lg bg-[#EBE4D8]">
        <img 
          src={getImageUrl(img)} 
          alt="Lookbook" 
          className="w-full h-full object-cover transition duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500" />
        <button className="absolute top-5 right-5 h-9 w-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white text-[#1A1715] shadow-md transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <Heart size={16} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Custom SVGs ──
const ShirtIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;
const LeafIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
const FitIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>;
const PrintIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
const TruckIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>;
const WalletIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;