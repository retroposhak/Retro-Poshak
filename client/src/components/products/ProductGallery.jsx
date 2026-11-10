import { motion, AnimatePresence } from 'framer-motion';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

// Safely encode paths for URLs, handling spaces and special chars like '&'
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  try {
    return encodeURI(formattedPath);
  } catch {
    return formattedPath.replace(/ /g, '%20');
  }
};

export default function ProductGallery({ images = [], activeImage, setActiveImage }) {
  const activeIndex = images.findIndex((img) => img === activeImage);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  if (!images.length) {
    return <div className="w-full bg-[#EBE4D8] aspect-[3/4] rounded-3xl" />;
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 w-full items-start">
      
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible hide-scrollbar w-full lg:w-20 shrink-0 lg:sticky lg:top-24">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`relative w-16 lg:w-full aspect-[3/4] shrink-0 bg-[#EBE4D8] overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                i === safeIndex 
                  ? 'border-[#1A1715] opacity-100 shadow-md scale-105' 
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img 
                src={getImageUrl(img)} 
                alt={`Thumbnail ${i + 1}`} 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 w-full bg-[#EBE4D8] overflow-hidden rounded-3xl shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full h-auto"
          >
            <InnerImageZoom
              src={getImageUrl(activeImage)}
              zoomSrc={getImageUrl(activeImage)}
              zoomType="hover"
              zoomScale={1.8}
              moveType="pan"
              fadeDuration={150}
              hideHint={true}
              className="w-full h-auto rounded-3xl"
              imgAttributes={{ 
                className: "w-full h-auto object-cover min-h-[400px] max-h-[85vh] rounded-3xl", 
                loading: "eager" 
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}