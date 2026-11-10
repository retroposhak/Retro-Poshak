import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  return formattedPath.replace(/ /g, '%20');
};

export default function CartItem({ item, onQty, onRemove }) {
  const { product, size, colour, quantity, price } = item;
  const stock = item.availableStock ?? 20;

  return (
    <div className="flex gap-5 border-b border-[#1A1715]/10 py-6 last:border-0 group">
      {/* Product Image */}
      <Link
        to={`/shop/${product.slug || product._id}`}
        className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#EBE4D8] border border-[#1A1715]/5"
      >
        {product.image && (
          <img 
            src={getImageUrl(product.image)} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
            onError={(e) => { e.target.style.display='none'; e.target.parentElement.classList.add('bg-cream-200'); }}
          />
        )}
      </Link>

      {/* Product Details */}
      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/shop/${product.slug || product._id}`} className="font-serif text-lg text-[#1A1715] hover:text-[#b33a3a] transition-colors leading-tight">
              {product.name}
            </Link>
            <p className="mt-1.5 text-xs text-[#1A1715]/60 font-sans tracking-wide">
              Size {size} · {colour}
            </p>
            {item.priceChanged && (
              <p className="mt-1 text-[11px] text-[#b33a3a]">Price updated to {formatINR(price)}</p>
            )}
          </div>
          <button
            onClick={() => onRemove(item)}
            aria-label="Remove"
            className="text-[#1A1715]/40 hover:text-[#b33a3a] transition-colors mt-1"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-4 flex items-end justify-between">
          {/* Quantity Pill */}
          <div className="inline-flex items-center rounded-full border border-[#1A1715]/20 bg-transparent h-9">
            <button
              onClick={() => onQty(item, Math.max(1, quantity - 1))}
              className="w-9 h-full flex items-center justify-center hover:text-[#b33a3a] transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => onQty(item, Math.min(stock, quantity + 1))}
              className="w-9 h-full flex items-center justify-center hover:text-[#b33a3a] transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {/* Price */}
          <span className="text-base font-medium text-[#1A1715]">
            {formatINR(price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}