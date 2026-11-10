import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="bg-[#F7F3EC] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative blurred circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C8A97E]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        <p className="font-display text-[150px] leading-none text-[#b33a3a] drop-shadow-sm">404</p>
        <h1 className="mt-2 font-serif text-4xl italic text-[#1A1715]">This page went for a walk.</h1>
        <p className="mt-4 text-[#1A1715]/50 font-sans max-w-md mx-auto">
          The story you're looking for isn't here — maybe it's back in the gully.
        </p>
        <Link 
          to="/" 
          className="mt-10 inline-flex items-center justify-center gap-2 bg-[#1A1715] text-[#F7F3EC] px-8 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#b33a3a] transition-colors shadow-lg group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
      </motion.div>
    </main>
  );
}