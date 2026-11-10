import { useState, useRef, useEffect } from "react";
import { Routes, Route, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  Phone,
  Mail,
  Clock,
  ChevronRight,
} from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { WishlistProvider, useWishlist } from "./context/WishlistContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import NotFoundPage from "./pages/NotFoundPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import OurStoryPage from "./pages/OurStoryPage";
import ContactPage from "./pages/ContactPage";
import PolicyPage from "./pages/PolicyPage";
import HomePage from "./pages/HomePage";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCoupons from "./pages/admin/AdminCoupons";

export default function App() {
  const location = useLocation();
  
  const isAuthPage = ["/login", "/signup", "/forgot-password", "/reset-password"].some((p) => location.pathname.startsWith(p));
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-dvh flex flex-col bg-[#F7F3EC]">
            {!isAuthPage && !isAdminPage && <Navbar />}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/our-story" element={<OurStoryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/policies/:slug" element={<PolicyPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/:id" element={<AdminProductEdit />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            {!isAuthPage && !isAdminPage && <Footer />}
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

// ── Navigation Bar ──
function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  const location = useLocation();
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false); 
    }
  };

  return (
    <>
      {/* Animated Announcement Ticker */}
      <div className="bg-[#1A1715] text-[#C8A97E] text-[10px] font-cond uppercase tracking-[0.2em] py-2.5 overflow-hidden border-b border-[#C8A97E]/20 flex">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="mx-4">Free shipping on orders above ₹1499</span> • 
          <span className="mx-4">Get 5% off on prepaid orders</span> • 
          <span className="mx-4">COD available across India</span> • 
          <span className="mx-4">New drops every Friday</span> • 
          <span className="mx-4">Free shipping on orders above ₹1499</span> • 
          <span className="mx-4">Get 5% off on prepaid orders</span> • 
          <span className="mx-4">COD available across India</span> • 
          <span className="mx-4">New drops every Friday</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-[#1A1715]/95 backdrop-blur-md text-[#F7F3EC] shadow-xl border-b border-[#C8A97E]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          
          {/* Hamburger Toggle - Visible on Mobile and Tablets (up to XL) */}
          <button
            className="xl:hidden text-[#C8A97E] p-2 -ml-2 hover:scale-110 transition-transform flex-shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="group flex items-center flex-shrink-0">
            <img 
              src="/assets/images/Retro_Poshak_Logo.png" 
              alt="Retro Poshak" 
              className="h-10 md:h-12 w-auto object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { 
                e.target.style.display = 'none'; 
                if(e.target.nextSibling) e.target.nextSibling.style.display = 'block'; 
              }}
            />
            <span className="hidden font-script text-3xl text-[#F7F3EC] drop-shadow-sm group-hover:text-[#C8A97E] transition-colors duration-500">
              Retro Poshak
            </span>
          </Link>

          {/* Desktop Nav Links - Hidden until XL (1280px) */}
          <div className="hidden xl:flex items-center gap-6 2xl:gap-8 font-cond text-[12px] 2xl:text-[13px] font-medium tracking-[0.2em] uppercase flex-shrink-0">
            {[
              { path: "/", label: "Home" },
              { path: "/shop", label: "Shop" },
              { path: "/our-story", label: "Our Story" },
              { path: "/blog", label: "Blog" },
              { path: "/contact", label: "Contact" },
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative group py-2 transition-all duration-500 ease-out ${
                    isActive 
                      ? "text-[#C8A97E]" 
                      : "text-[#F7F3EC]/80 hover:text-[#F7F3EC]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#C8A97E] to-[#E8DCC4] transform origin-left transition-transform duration-500 ease-out ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'}`} />
                  </>
                )}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" className="text-[#C8A97E] hover:text-white transition-colors relative group py-2">
                Admin Panel
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C8A97E] transform origin-left transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100" />
              </NavLink>
            )}
          </div>

          {/* Right Side: Search, Profile, Wishlist, Cart */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            
            {/* Aesthetic Expanding Search Bar - Hidden on Mobile (handled below) */}
            <form 
              onSubmit={handleSearch} 
              className="hidden sm:flex relative group items-center bg-[#2A2522] border border-[#C8A97E]/20 rounded-full px-4 py-2 transition-all duration-300 focus-within:bg-[#1A1715] focus-within:border-[#C8A97E]/60 focus-within:shadow-[0_0_15px_rgba(200,169,126,0.15)] w-48 lg:w-64"
            >
              <Search size={16} className="text-[#C8A97E]/60 group-focus-within:text-[#C8A97E] transition-colors mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-[#F7F3EC] text-sm w-full outline-none placeholder:text-[#F7F3EC]/30 font-sans tracking-wide"
              />
            </form>

            <div className="flex items-center gap-3 sm:gap-4 border-l border-[#C8A97E]/20 pl-3 sm:pl-5">
              
              {/* User Profile */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="text-[#F7F3EC]/80 hover:text-[#C8A97E] hover:scale-110 transition-all"
                >
                  <User size={20} strokeWidth={1.5} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-4 w-48 bg-[#F7F3EC] border border-[#1A1715]/10 shadow-2xl rounded-sm overflow-hidden text-[#1A1715] animate-fade-up z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 bg-[#EBE4D8] border-b border-[#1A1715]/5">
                          <p className="font-serif italic text-lg truncate">{user?.name}</p>
                          <p className="text-[10px] font-cond uppercase tracking-wider text-[#1A1715]/60 truncate">{user?.email}</p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2.5 text-sm font-cond uppercase tracking-wider hover:bg-[#EBE4D8] transition-colors">My Profile</Link>
                        <Link to="/orders" className="block px-4 py-2.5 text-sm font-cond uppercase tracking-wider hover:bg-[#EBE4D8] transition-colors">My Orders</Link>
                        {isAdmin && (
                          <Link to="/admin" className="block px-4 py-2.5 text-sm font-cond uppercase tracking-wider text-[#C8A97E] font-bold hover:bg-[#EBE4D8] transition-colors">Admin Dashboard</Link>
                        )}
                        <div className="border-t border-[#1A1715]/10 mt-1">
                          <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-4 py-3 text-sm font-cond uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors">
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-2">
                        <Link to="/login" className="block w-full text-center bg-[#1A1715] text-[#F7F3EC] text-xs font-cond tracking-[0.15em] uppercase py-3 rounded-sm hover:bg-[#C8A97E] transition-colors mb-2">Login</Link>
                        <Link to="/signup" className="block w-full text-center text-xs font-cond tracking-[0.15em] uppercase text-[#1A1715]/70 hover:text-[#1A1715] transition-colors py-2">Create Account</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative text-[#F7F3EC]/80 hover:text-[#C8A97E] hover:scale-110 transition-all">
                <Heart size={20} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 bg-[#C8A97E] text-[#1A1715] text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pop-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              {/* Cart */}
              <Link to="/cart" className="relative text-[#F7F3EC]/80 hover:text-[#C8A97E] hover:scale-110 transition-all">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 bg-[#C8A97E] text-[#1A1715] text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pop-in">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile-Only Search Bar - Always visible below main navbar on small screens */}
        <div className="sm:hidden px-4 pb-4 pt-2 bg-[#1A1715]">
          <form 
            onSubmit={handleSearch} 
            className="relative flex items-center bg-[#2A2522] border border-[#C8A97E]/20 rounded-full px-4 py-2.5 focus-within:bg-[#1A1715] focus-within:border-[#C8A97E]/60 transition-all duration-300 w-full"
          >
            <Search size={16} className="text-[#C8A97E]/60 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search the collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[#F7F3EC] text-sm w-full outline-none placeholder:text-[#F7F3EC]/30 font-sans tracking-wide"
            />
          </form>
        </div>

        {/* Mobile/Tablet Menu Dropdown - Now only for Navigation Links */}
        <div className={`xl:hidden overflow-hidden transition-all duration-500 bg-[#1A1715] border-t border-[#C8A97E]/10 ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-6 space-y-4 text-sm font-cond tracking-[0.15em] uppercase text-[#F7F3EC]">
            <Link to="/" className="block hover:text-[#C8A97E]">Home</Link>
            <Link to="/shop" className="block hover:text-[#C8A97E]">Shop</Link>
            <Link to="/our-story" className="block hover:text-[#C8A97E]">Our Story</Link>
            <Link to="/blog" className="block hover:text-[#C8A97E]">Blog</Link>
            <Link to="/contact" className="block hover:text-[#C8A97E]">Contact</Link>
            
            {isAdmin && (
              <Link to="/admin" className="block text-[#C8A97E] font-bold hover:text-white transition-colors mt-2 pt-4 border-t border-[#C8A97E]/20">
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

// ── Footer (Dark Aesthetic) ──
function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const { newsletterService } = await import("./services/newsletterService");
      await newsletterService.subscribe(email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch { /* silent */ }
  };

  return (
    <footer className="relative bg-[#1A1715] text-[#F7F3EC] pt-20 pb-10 overflow-hidden border-t border-[#C8A97E]/20">
      
      {/* Watermark Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[200px] md:text-[300px] font-display text-white/[0.02] pointer-events-none select-none tracking-tighter mix-blend-overlay">
        YAADEN
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Newsletter Strip */}
        <div className="flex flex-col xl:flex-row items-center justify-between border-b border-[#C8A97E]/20 pb-16 mb-16 gap-12">
          <div className="text-center xl:text-left flex-1">
            <span className="font-script text-3xl text-[#C8A97E] mb-2 block">Join the club</span>
            <h3 className="font-serif text-4xl md:text-5xl text-[#F7F3EC] tracking-tight">
              STAY IN THE LOOP<span className="text-[#C8A97E]">.</span>
            </h3>
            <p className="text-[#F7F3EC]/50 text-sm mt-3 font-light max-w-md mx-auto xl:mx-0 font-sans">
              Get early access to new drops, nostalgic stories, and special offers straight to your inbox.
            </p>
          </div>
          
          <form onSubmit={subscribe} className="flex w-full max-w-md border-b border-[#C8A97E]/50 pb-2 relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="bg-transparent text-[#F7F3EC] text-base w-full outline-none placeholder:text-[#F7F3EC]/30 font-sans tracking-wide"
              required
            />
            <button className="text-[#C8A97E] text-sm font-cond uppercase tracking-[0.2em] hover:text-white transition-colors whitespace-nowrap ml-4 flex items-center gap-2">
              {subscribed ? "Subscribed ✓" : "Subscribe"}
              {!subscribed && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#F7F3EC] transform origin-left scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out" />
          </form>

          {/* Polaroids Decoration */}
          <div className="hidden 2xl:flex items-center gap-6 shrink-0">
            <div className="relative bg-[#F7F3EC] p-2 pb-6 shadow-lg rotate-[-4deg] w-28 hover:rotate-0 hover:scale-105 transition-all duration-300">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-[#C8A97E]/40 mix-blend-multiply" />
              <img src="/assets/images/shopbystory/dostonkibaithak.jpeg" alt="Dosti" className="w-full h-24 object-cover grayscale-[30%]" />
              <p className="absolute bottom-2 left-0 w-full text-center font-script text-sm text-[#1A1715]/60">dosti</p>
            </div>
            <div className="relative bg-[#F7F3EC] p-2 pb-6 shadow-lg rotate-[3deg] w-28 hover:rotate-0 hover:scale-105 transition-all duration-300">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-[#C8A97E]/40 mix-blend-multiply" />
              <img src="/assets/images/shopbystory/wohgaanewohdin.jpeg" alt="Yaadein" className="w-full h-24 object-cover grayscale-[30%]" />
              <p className="absolute bottom-2 left-0 w-full text-center font-script text-sm text-[#1A1715]/60">yaadein</p>
            </div>
            <div className="font-script text-2xl text-[#C8A97E] rotate-[-2deg] leading-tight">
              Same<br/>gully.<br/>New fits.
            </div>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-10 mb-20 text-sm font-sans font-light">
          
          <div className="col-span-2 xl:col-span-2 pr-8">
            <Link to="/" className="inline-block mb-6 group">
              <img 
                src="/assets/images/Retro_Poshak_Logo.png" 
                alt="Retro Poshak" 
                className="h-14 w-auto object-contain mix-blend-screen group-hover:scale-105 transition-transform"
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  if(e.target.nextSibling) e.target.nextSibling.style.display = 'block'; 
                }}
              />
              <span className="hidden font-script text-4xl text-[#F7F3EC] group-hover:text-[#C8A97E] transition-colors">Retro Poshak</span>
            </Link>
            <p className="text-[#F7F3EC]/50 leading-relaxed mb-8 max-w-xs">
              Premium oversized tees inspired by real Indian nostalgia. We turn memories into everyday fits.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full border border-[#C8A97E]/30 flex items-center justify-center text-[#C8A97E] hover:bg-[#C8A97E] hover:text-[#1A1715] transition-all duration-300 hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-cond uppercase tracking-[0.2em] text-[#C8A97E] mb-6">Shop</h4>
            <ul className="space-y-4 text-[#F7F3EC]/60 text-[13px] tracking-wide">
              <li><Link to="/shop" className="hover:text-[#F7F3EC] transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-[#F7F3EC] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-[#F7F3EC] transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop" className="hover:text-[#F7F3EC] transition-colors">Collections</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-cond uppercase tracking-[0.2em] text-[#C8A97E] mb-6">Help</h4>
            <ul className="space-y-4 text-[#F7F3EC]/60 text-[13px] tracking-wide">
              <li><Link to="/track-order" className="hover:text-[#F7F3EC] transition-colors">Track Order</Link></li>
              <li><Link to="/policies/shipping-policy" className="hover:text-[#F7F3EC] transition-colors">Shipping</Link></li>
              <li><Link to="/policies/returns" className="hover:text-[#F7F3EC] transition-colors">Returns</Link></li>
              <li><Link to="/policies/faqs" className="hover:text-[#F7F3EC] transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-cond uppercase tracking-[0.2em] text-[#C8A97E] mb-6">Company</h4>
            <ul className="space-y-4 text-[#F7F3EC]/60 text-[13px] tracking-wide">
              <li><Link to="/our-story" className="hover:text-[#F7F3EC] transition-colors">Our Story</Link></li>
              <li><Link to="/blog" className="hover:text-[#F7F3EC] transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-[#F7F3EC] transition-colors">Contact Us</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-[#F7F3EC] transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact & Payment Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 py-8 border-t border-[#C8A97E]/10 text-[13px] text-[#F7F3EC]/60 font-light">
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-[#C8A97E]" />
            <a href="tel:+919220722844" className="hover:text-[#F7F3EC] transition-colors">+91 92207 22844</a>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-[#C8A97E]" />
            <a href="mailto:retroposhak2026@gmail.com" className="hover:text-[#F7F3EC] transition-colors">retroposhak2026@gmail.com</a>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-[#C8A97E]" />
            <span>Mon - Sat, 10AM - 7PM</span>
          </div>
          <div className="flex items-center gap-2 xl:justify-end">
            <span className="border border-[#C8A97E]/20 text-[#C8A97E] px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm font-cond">UPI</span>
            <span className="border border-[#C8A97E]/20 text-[#C8A97E] px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm font-cond">Visa</span>
            <span className="border border-[#C8A97E]/20 text-[#C8A97E] px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm font-cond">Mastercard</span>
            <span className="border border-[#C8A97E]/20 text-[#C8A97E] px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm font-cond">COD</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#C8A97E]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#F7F3EC]/30 uppercase tracking-[0.2em] font-cond">
          <p>© {currentYear} Retro Poshak. All rights reserved.</p>
          <p>Made with ♡ in India</p>
        </div>
      </div>
    </footer>
  );
}