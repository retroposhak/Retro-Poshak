import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatINR } from '../utils/formatCurrency';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderService.get(orderId).then(setOrder).catch(() => {});
  }, [orderId]);

  return (
    <main className="bg-[#F7F3EC] min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      
      {/* Background Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8A97E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        
        {/* Animated Checkmark */}
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#2c7a4a]/10 text-[#2c7a4a] shadow-inner mb-8"
        >
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#b33a3a] block mb-3">
            Success
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#1A1715] italic mb-4">
            Order Placed!
          </h1>
          <p className="text-[#1A1715]/60 text-sm md:text-base font-sans max-w-md mx-auto">
            Thank you for shopping with Retro Poshak. Your order is confirmed and we are preparing it with care.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 inline-block bg-[#EBE4D8] px-8 py-4 rounded-2xl border border-[#1A1715]/5 shadow-sm"
        >
          <span className="text-xs font-cond uppercase tracking-widest text-[#1A1715]/50 block mb-1">Order Number</span>
          <span className="text-xl font-serif font-bold text-[#1A1715] tracking-wider">#{orderId}</span>
        </motion.div>

        {order && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-6 md:p-8 text-left shadow-xl"
          >
            <h3 className="font-serif text-xl border-b border-[#1A1715]/10 pb-4 mb-4">Order Summary</h3>
            <ul className="space-y-4">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between items-start gap-4 text-sm font-sans">
                  <div>
                    <p className="font-medium text-[#1A1715]">{i.name}</p>
                    <p className="text-[#1A1715]/50 text-xs mt-1">Size: {i.size} · Colour: {i.colour} · Qty: {i.quantity}</p>
                  </div>
                  <span className="text-[#1A1715] font-medium">{formatINR(i.unitPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-[#1A1715]/10 pt-4 flex justify-between items-center">
              <span className="font-serif text-lg">Total <span className="text-sm text-[#1A1715]/50 font-sans ml-1">({order.paymentMethod})</span></span>
              <span className="font-serif text-2xl text-[#1A1715]">{formatINR(order.total)}</span>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to={`/orders/${orderId}`} className="flex items-center justify-center gap-2 bg-[#1A1715] text-[#F7F3EC] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#b33a3a] transition-colors rounded-full shadow-lg">
            View Order <span className="text-lg leading-none">→</span>
          </Link>
          <Link to="/shop" className="flex items-center justify-center gap-2 bg-transparent border border-[#1A1715]/20 text-[#1A1715] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:border-[#1A1715] transition-colors rounded-full">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </motion.div>
      </div>
    </main>
  );
}