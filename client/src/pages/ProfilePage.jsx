import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogOut, Package, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/', { replace: true });
  };

  return (
    <main className="bg-[#F7F3EC] min-h-screen py-16">
      <div className="container-page max-w-3xl">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-8 sm:p-12 shadow-sm text-center"
        >
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#b33a3a] block mb-6">My Account</span>
          
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#1A1715] text-[#F7F3EC] font-serif text-4xl italic shadow-lg mb-6">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl text-[#1A1715]">{user?.name}</h1>
          <p className="text-sm font-sans text-[#1A1715]/50 mt-2">{user?.email}</p>
          
          {isAdmin && (
            <span className="inline-block mt-4 bg-[#b33a3a]/10 text-[#b33a3a] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Administrator
            </span>
          )}

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/orders" className="group bg-[#F7F3EC] border border-[#1A1715]/10 rounded-2xl p-6 text-left hover:border-[#1A1715]/30 transition-colors">
              <Package size={24} className="text-[#1A1715]/40 mb-4 group-hover:text-[#b33a3a] transition-colors" />
              <p className="font-serif text-lg text-[#1A1715]">My Orders</p>
              <p className="text-xs font-sans text-[#1A1715]/50 mt-1 flex items-center justify-between">
                View history <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </Link>
            
            <Link to="/wishlist" className="group bg-[#F7F3EC] border border-[#1A1715]/10 rounded-2xl p-6 text-left hover:border-[#1A1715]/30 transition-colors">
              <Heart size={24} className="text-[#1A1715]/40 mb-4 group-hover:text-[#b33a3a] transition-colors" />
              <p className="font-serif text-lg text-[#1A1715]">Wishlist</p>
              <p className="text-xs font-sans text-[#1A1715]/50 mt-1 flex items-center justify-between">
                Saved stories <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1A1715]/10">
            <button 
              onClick={handleLogout} 
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#b33a3a]/30 text-[#b33a3a] px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#b33a3a]/5 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}