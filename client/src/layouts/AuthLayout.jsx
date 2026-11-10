import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout({
  variant = 'left', 
  eyebrow = 'WELCOME BACK',
  headline = (
    <>
      Wear your
      <br />
      <em>yaaden.</em>
    </>
  ),
  sub = 'Sign in to track orders, save favourites, and relive the memories.',
  photos = [
    'assets/images/shopbystory/dostonkibaithak.jpeg',
    'assets/images/shopbystory/wohlambicalls.jpeg',
    'assets/images/shopbystory/ekchaihazaarkisse.jpeg',
  ],
  footLabel = 'Est. 2026 · Made in India',
  children,
}) {
  const isLeft = variant === 'left';

  // Organic curve connecting the dark panel to the light form
  const curveRadius = '140px';
  const curveStyle = {
    borderTopLeftRadius: isLeft ? 0 : curveRadius,
    borderBottomLeftRadius: isLeft ? 0 : curveRadius,
    borderTopRightRadius: isLeft ? curveRadius : 0,
    borderBottomRightRadius: isLeft ? curveRadius : 0,
  };

  return (
    <main className="h-[100dvh] w-full flex overflow-hidden bg-[#F4EDE1]">
      
      {/* ═══════════ DARK CINEMATIC PANEL ═══════════ */}
      <div
        className={`hidden lg:flex flex-col justify-between lg:w-[52%] relative overflow-hidden p-10 xl:p-14 ${
          isLeft ? 'order-1' : 'order-2'
        }`}
        style={curveStyle}
      >
        {/* Deep moody background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3A2C25] via-[#2A1E18] to-[#1A120E]" />
        
        {/* Rich ambient glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,120,50,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(179,58,58,0.15),transparent_50%)]" />

        {/* Subtle noise/grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
          }}
        />

        {/* Giant watermark letter */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 font-serif italic text-[30rem] leading-none text-white/[0.03] select-none pointer-events-none ${
            isLeft ? '-left-8' : '-right-8'
          }`}
        >
          Y
        </div>

        {/* Vertical accents */}
        <div className="absolute left-10 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute right-10 top-1/3 bottom-1/5 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* ── TOP ZONE: Polaroid + Eyebrow ── */}
        <div className="relative z-20 flex justify-between items-start w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0], rotate: [-8, -5, -8] }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              y: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
              rotate: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
            }}
            className={`w-40 xl:w-48 bg-[#FDFBF6] p-2.5 pb-10 shadow-2xl rounded-sm ${
              !isLeft ? 'order-2 -mt-4 -mr-4' : '-mt-4 -ml-4'
            }`}
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#D9C08A]/80 mix-blend-multiply rotate-2 rounded-sm" />
            <img src={photos[0]} alt="" className="w-full h-32 xl:h-40 object-cover sepia-[0.2]" />
            <span className="absolute bottom-2.5 left-0 w-full text-center font-script text-[22px] text-[#1A1715]/60">dosti</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className={`flex items-center gap-3 mt-8 ${!isLeft ? 'order-1 mr-auto' : 'ml-auto'}`}
          >
            {isLeft && <span className="block h-px w-8 bg-[#D9C08A]/60" />}
            <span className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#D9C08A]">
              {eyebrow}
            </span>
            {!isLeft && <span className="block h-px w-8 bg-[#D9C08A]/60" />}
          </motion.div>
        </div>

        {/* ── CENTER ZONE: Editorial Text ── */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-40 max-w-md my-auto ${
            isLeft ? 'text-left' : 'text-right ml-auto'
          }`}
        >
          <h2 className="font-serif text-5xl xl:text-6xl text-[#FDFBF6] leading-[1.05] drop-shadow-lg">
            {headline}
          </h2>
          
          <p className={`mt-6 text-sm text-[#FDFBF6]/60 font-sans leading-relaxed max-w-[280px] ${
            isLeft ? '' : 'ml-auto'
          }`}>
            {sub}
          </p>
        </motion.div>

        {/* ── BOTTOM ZONE: Footer + Remaining Polaroids ── */}
        <div className="relative z-20 flex justify-between items-end w-full">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#FDFBF6]/40 mb-2 ${
              !isLeft ? 'order-2 ml-auto' : ''
            }`}
          >
            <span className="block h-px w-8 bg-[#FDFBF6]/20" />
            <span>{footLabel}</span>
          </motion.div>

          {/* Bottom Right Polaroid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 15 }}
            animate={{ opacity: 1, scale: 1, y: [0, 12, 0], rotate: [6, 9, 6] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.2 },
              scale: { duration: 0.8, delay: 0.2 },
              y: { repeat: Infinity, duration: 7, ease: 'easeInOut' },
              rotate: { repeat: Infinity, duration: 7, ease: 'easeInOut' },
            }}
            className={`w-40 xl:w-48 bg-[#FDFBF6] p-2.5 pb-10 shadow-2xl rounded-sm ${
              !isLeft ? 'order-1 -ml-6 -mb-6' : '-mr-6 -mb-6'
            }`}
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#D9C08A]/80 mix-blend-multiply -rotate-2 rounded-sm" />
            <img src={photos[1]} alt="" className="w-full h-32 xl:h-40 object-cover sepia-[0.2]" />
            <span className="absolute bottom-2.5 left-0 w-full text-center font-script text-[22px] text-[#1A1715]/60">yaadein</span>
          </motion.div>
        </div>

        {/* Extra floating polaroid tucked away nicely */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0], rotate: [-4, -1, -4] }}
          transition={{
            opacity: { duration: 0.8, delay: 0.4 },
            scale: { duration: 0.8, delay: 0.4 },
            y: { repeat: Infinity, duration: 8, ease: 'easeInOut' },
            rotate: { repeat: Infinity, duration: 8, ease: 'easeInOut' },
          }}
          className={`absolute bottom-[15%] w-36 xl:w-44 bg-[#FDFBF6] p-2.5 pb-10 shadow-2xl z-10 rounded-sm ${
            isLeft ? 'left-10 xl:left-14' : 'right-10 xl:right-14'
          }`}
        >
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#D9C08A]/80 mix-blend-multiply rotate-1 rounded-sm" />
          <img src={photos[2]} alt="" className="w-full h-28 xl:h-36 object-cover sepia-[0.2]" />
          <span className="absolute bottom-2.5 left-0 w-full text-center font-script text-[22px] text-[#1A1715]/60">bachpan</span>
        </motion.div>

        {/* Soft edge glow along the curve */}
        <div
          className={`absolute top-0 bottom-0 w-32 pointer-events-none z-20 ${
            isLeft ? 'right-0' : 'left-0'
          } ${isLeft ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-transparent to-[#F4EDE1]/10`}
          style={curveStyle}
        />
      </div>

      {/* ═══════════ LIGHT FORM PANEL ═══════════ */}
      <div
        className={`w-full lg:w-[48%] h-[100dvh] flex flex-col relative overflow-hidden bg-[#F4EDE1] ${
          isLeft ? 'order-2' : 'order-1'
        }`}
      >
        {/* Ambient warm blobs for the form side */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#b33a3a]/[0.04] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#D9C08A]/20 rounded-full blur-[90px] pointer-events-none" />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.2] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #1A1715 0.6px, transparent 0.6px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />

        {/* Corner script */}
        <span
          className={`absolute top-6 font-script italic text-[#1A1715]/[0.06] text-3xl pointer-events-none hidden xl:block ${
            isLeft ? 'right-8' : 'left-8'
          }`}
        >
          yaadon ka safar
        </span>

        {/* Scrollable container (acts as perfect center on large screens, scrolls only on tiny screens) */}
        <div className="relative z-10 flex-1 flex overflow-y-auto overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="m-auto w-full max-w-[400px] px-6 py-8 sm:px-10 lg:px-8 xl:px-12"
          >
            <Link to="/" className="mb-6 inline-flex items-center gap-2 lg:hidden">
              <span className="font-script text-3xl text-[#1A1715]">Retro Poshak</span>
            </Link>

            {children}
          </motion.div>
        </div>
      </div>
    </main>
  );
}