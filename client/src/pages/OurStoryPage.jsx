import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function OurStoryPage() {
  return (
    <main className="bg-[#F7F3EC] min-h-screen">
      
      {/* ═══════════ MAIN SPLIT SECTION ═══════════ */}
      <section className="relative w-full flex flex-col lg:flex-row min-h-[85vh] border-b border-[#1A1715]/10">
        
        {/* LEFT: Text Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full lg:w-[50%] flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:pl-24 relative z-20"
          style={{
            backgroundColor: '#F7F3EC',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
          }}
        >
          <div className="w-full max-w-xl relative">
            <motion.span variants={fadeUp} className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#b33a3a] block mb-6">
              Our Story
            </motion.span>
            
            <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-7xl lg:text-[80px] text-[#1A1715] leading-[1.05] tracking-tight">
              More Than<br/>Just T-Shirts.
            </motion.h1>
            
            <motion.div variants={fadeUp} className="relative mt-5 mb-8">
              <p className="font-script text-5xl md:text-6xl text-[#b33a3a] rotate-[-2deg]">
                It's a feeling.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-5 text-[#1A1715]/80 leading-relaxed text-sm md:text-[15px] font-sans max-w-md pt-2">
              <p>
                Retro Poshak is a celebration of the little moments that made our childhood extraordinary. The guliyan, the cycles, the school days, the gola walas, the chai tapris, the old radios, the kites, the friendships and the places that still feel like home.
              </p>
              <p>
                We create premium, oversized t-shirts inspired by real Indian nostalgia — for everyone who still carries those yaaden in their heart.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10">
              <Link to="/shop" className="inline-flex items-center justify-center gap-3 bg-[#1A1715] text-[#F7F3EC] px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#b33a3a] transition-all duration-300 group">
                Shop the Collection
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT: Image Content with Subtle Torn Edge */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full lg:w-[50%] relative min-h-[50vh] lg:min-h-full z-10"
        >
          {/* The Torn Paper Edge Effect (Only visible on desktop) */}
          <div 
            className="absolute top-0 bottom-0 left-0 w-16 bg-[#F7F3EC] z-20 hidden lg:block"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 80% 5%, 100% 10%, 70% 15%, 100% 20%, 80% 25%, 100% 30%, 70% 35%, 100% 40%, 80% 45%, 100% 50%, 70% 55%, 100% 60%, 80% 65%, 100% 70%, 70% 75%, 100% 80%, 80% 85%, 100% 90%, 70% 95%, 100% 100%, 0 100%)',
              filter: 'drop-shadow(4px 0px 10px rgba(0,0,0,0.1))'
            }}
          />

          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/assets/images/ourstory-hero.jpeg"
              alt="Nostalgic Indian street"
              className="w-full h-full object-cover object-center"
            />
            {/* Soft warm overlay */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7F3EC]/20 via-transparent to-transparent pointer-events-none" />

            {/* Floating Cursive Note Card */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [3, 5, 3] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              className="absolute top-12 right-8 lg:top-20 lg:right-12 bg-[#F7F3EC]/90 backdrop-blur-md p-6 md:p-8 shadow-2xl max-w-[280px] border border-[#1A1715]/10 z-30"
              style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-[#C8A97E]/40 mix-blend-multiply rotate-2" />
              <p className="font-script text-3xl md:text-4xl text-[#1A1715] leading-tight text-center">
                Same<br/>streets.<br/>Different<br/>generations.<br/>
                <em className="text-[#b33a3a] not-italic mt-2 block text-2xl md:text-3xl">Same feelings.</em>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ VALUES STRIP ═══════════ */}
      <section className="relative bg-[#EBE4D8] py-16 md:py-24">
        
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply" 
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-[#1A1715]/10"
          >
            {[
              { 
                title: 'Real Stories', 
                desc: 'Inspired by everyday Indian life.', 
                icon: (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A1715]/70 group-hover:text-[#b33a3a] transition-colors duration-300">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    <path d="M8 7h6" />
                    <path d="M8 11h8" />
                  </svg>
                )
              },
              { 
                title: 'Nostalgic Soul', 
                desc: 'Rooted in the places, people and moments we love.', 
                icon: (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A1715]/70 group-hover:text-[#b33a3a] transition-colors duration-300">
                    <circle cx="5.5" cy="17.5" r="3.5" />
                    <circle cx="18.5" cy="17.5" r="3.5" />
                    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
                  </svg>
                )
              },
              { 
                title: 'Timeless Designs', 
                desc: 'Made for today. Inspired by yesterday.', 
                icon: (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A1715]/70 group-hover:text-[#b33a3a] transition-colors duration-300">
                    <rect x="2" y="6" width="20" height="12" rx="1" />
                    <circle cx="7" cy="12" r="2" />
                    <circle cx="17" cy="12" r="2" />
                    <path d="M9 12h6" />
                  </svg>
                )
              },
              { 
                title: 'Made for Everyone', 
                desc: 'For the kids we were, and the adults we are now.', 
                icon: (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A1715]/70 group-hover:text-[#b33a3a] transition-colors duration-300">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                )
              },
            ].map((v) => (
              <motion.div 
                key={v.title} 
                variants={fadeUp}
                className="group flex flex-col items-center text-center px-4 md:px-6 cursor-default"
              >
                <motion.div 
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="h-20 w-20 mb-5 flex items-center justify-center bg-[#F7F3EC] rounded-full shadow-sm group-hover:shadow-md transition-all duration-300 border border-[#1A1715]/5"
                >
                  {v.icon}
                </motion.div>
                <h4 className="text-[11px] font-cond font-bold tracking-[0.15em] uppercase text-[#1A1715] mb-3 group-hover:text-[#b33a3a] transition-colors">
                  {v.title}
                </h4>
                <p className="text-[13px] text-[#1A1715]/60 leading-relaxed font-sans max-w-[200px]">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}