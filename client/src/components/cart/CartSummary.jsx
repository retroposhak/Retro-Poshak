import { Link } from 'react-router-dom';
import { ShieldCheck, RotateCcw, Truck } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';
import { useAuth } from '../../context/AuthContext';

export default function CartSummary({ totals, itemCount, disabled }) {
  const { isAuthenticated } = useAuth();
  const checkoutHref = isAuthenticated ? '/checkout' : '/login?redirect=/checkout';
  const remaining = Math.max(0, 1499 - totals.subtotal);

  return (
    <div className="bg-[#EBE4D8]/50 border border-[#1A1715]/10 rounded-2xl p-6 md:p-8 shadow-sm sticky top-24">
      <h2 className="font-serif text-2xl text-[#1A1715] border-b border-[#1A1715]/10 pb-4">Order Summary</h2>

      <div className="mt-6 space-y-3 text-sm font-sans">
        <div className="flex justify-between text-[#1A1715]/70">
          <span>Subtotal</span>
          <span>{formatINR(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-[#1A1715]/70">
          <span>Shipping</span>
          <span>{totals.shipping === 0 ? <span className="text-[#b33a3a] font-bold uppercase tracking-wider text-xs">Free</span> : formatINR(totals.shipping)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-[#b33a3a]">
            <span>Discount</span>
            <span>−{formatINR(totals.discount)}</span>
          </div>
        )}
        <div className="border-t border-[#1A1715]/10 pt-4 flex justify-between items-center mt-4">
          <span className="font-serif text-xl text-[#1A1715]">Total</span>
          <span className="font-serif text-2xl text-[#1A1715]">{formatINR(totals.total)}</span>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {totals.subtotal > 0 && totals.subtotal < 1499 && (
        <div className="mt-6 p-4 rounded-xl bg-[#F7F3EC] border border-[#1A1715]/5">
          <p className="text-xs text-[#1A1715]/70 text-center">
            Add <strong className="text-[#b33a3a]">{formatINR(remaining)}</strong> more for <strong>free shipping</strong>.
          </p>
          <div className="mt-3 h-1.5 w-full bg-[#1A1715]/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#b33a3a] transition-all duration-500" 
              style={{ width: `${(totals.subtotal / 1499) * 100}%` }}
            />
          </div>
        </div>
      )}
      {totals.subtotal >= 1499 && (
        <div className="mt-6 p-4 rounded-xl bg-[#b33a3a]/10 border border-[#b33a3a]/20">
          <p className="text-xs text-[#b33a3a] text-center font-bold uppercase tracking-wider">
            🎉 You qualify for free shipping!
          </p>
        </div>
      )}

      <Link
        to={checkoutHref}
        aria-disabled={disabled}
        onClick={(e) => disabled && e.preventDefault()}
        className={`w-full mt-8 bg-[#1A1715] text-[#F7F3EC] text-xs font-bold tracking-[0.2em] uppercase h-14 flex items-center justify-center hover:bg-[#b33a3a] transition-colors rounded-full shadow-lg ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
      </Link>

      {/* Trust Badges */}
      <div className="mt-8 pt-6 border-t border-[#1A1715]/10 space-y-3 text-[11px] text-[#1A1715]/50 font-sans">
        <div className="flex items-center gap-2 justify-center">
          <ShieldCheck size={14} /> Secure checkout
        </div>
        <div className="flex items-center gap-2 justify-center">
          <RotateCcw size={14} /> Easy returns within 7 days
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Truck size={14} /> COD available across India
        </div>
      </div>
    </div>
  );
}