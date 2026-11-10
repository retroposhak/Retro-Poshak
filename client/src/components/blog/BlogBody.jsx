import { motion } from 'framer-motion';

const blockVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  return formattedPath.replace(/ /g, '%20');
};

export default function BlogBody({ blocks = [] }) {
  return (
    <div className="space-y-6 text-[#1A1715]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return (
              <motion.p 
                key={i} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={blockVariants}
                className={i === 0 ? 'first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:italic text-[#1A1715]/80 leading-[1.8] text-lg' : 'text-[#1A1715]/80 leading-[1.8] text-lg font-light'}
              >
                {b.text}
              </motion.p>
            );
          case 'h2':
            return (
              <motion.h2 
                key={i} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={blockVariants}
                className="mt-12 font-serif text-3xl italic text-[#1A1715]"
              >
                {b.text}
              </motion.h2>
            );
          case 'h3':
            return (
              <motion.h3 
                key={i} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={blockVariants}
                className="mt-10 font-serif text-2xl text-[#1A1715]"
              >
                {b.text}
              </motion.h3>
            );
          case 'quote':
            return (
              <motion.blockquote 
                key={i} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={blockVariants}
                className="my-10 border-l-4 border-[#b33a3a] pl-6 py-2 font-serif text-2xl italic text-[#1A1715] bg-[#EBE4D8]/30"
              >
                "{b.text}"
              </motion.blockquote>
            );
          case 'image':
            return (
              <motion.figure 
                key={i} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={blockVariants}
                className="my-10"
              >
                <img src={getImageUrl(b.src)} alt={b.alt || ''} className="w-full rounded-2xl shadow-lg" />
                {b.caption && (
                  <figcaption className="mt-3 text-center text-xs text-[#1A1715]/50 font-sans uppercase tracking-wider">
                    {b.caption}
                  </figcaption>
                )}
              </motion.figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}