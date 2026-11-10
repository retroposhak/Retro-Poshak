import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatINR } from '../utils/formatCurrency';
import { StatusChip } from './OrdersPage';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  return formattedPath.replace(/ /g, '%20');
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .get(orderId)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const cancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const updated = await orderService.cancel(orderId);
      setOrder(updated);
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not cancel order');
    }
  };

  if (loading) {
    return (
      <main className="bg-[#F7F3EC] min-h-screen py-16">
        <div className="container-page max-w-5xl">
          <div className="h-64 rounded-3xl bg-[#EBE4D8] animate-pulse" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="bg-[#F7F3EC] min-h-screen py-24 text-center">
        <h2 className="font-serif text-3xl">Order not found</h2>
        <Link to="/orders" className="mt-4 inline-block text-[#b33a3a] hover:underline">Back to Orders</Link>
      </main>
    );
  }

  const canCancel = !['shipped', 'delivered', 'cancelled'].includes(order.status);

  return (
    <main className="bg-[#F7F3EC] min-h-screen py-16">
      <div className="container-page max-w-5xl">
        
        <Link to="/orders" className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-[#1A1715]/50 hover:text-[#b33a3a] transition-colors mb-8">
          <ArrowLeft size={14} /> All Orders
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1715]">Order #{order.orderId}</h1>
            <p className="text-sm font-sans text-[#1A1715]/50 mt-2">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
          <StatusChip status={order.status} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
          
          {/* Left Column: Items & Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Items Card */}
            <div className="bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#1A1715]/10 pb-4 mb-6">
                <Package size={20} className="text-[#1A1715]/40" />
                <h2 className="font-serif text-xl text-[#1A1715]">Items in this order</h2>
              </div>
              
              <div className="space-y-6">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex gap-4 sm:gap-6">
                    <div className="h-24 w-20 shrink-0 rounded-xl overflow-hidden bg-[#EBE4D8] border border-[#1A1715]/5">
                      <img src={getImageUrl(i.image)} alt={i.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="font-serif text-lg text-[#1A1715]">{i.name}</p>
                      <p className="text-xs font-sans text-[#1A1715]/50 mt-1">Size: {i.size} · Colour: {i.colour}</p>
                      <p className="text-xs font-sans text-[#1A1715]/50 mt-1">Qty: {i.quantity}</p>
                    </div>
                    <div className="text-right flex items-center">
                      <p className="font-serif text-lg text-[#1A1715]">{formatINR(i.unitPrice * i.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-xl text-[#1A1715] border-b border-[#1A1715]/10 pb-4 mb-6">Timeline</h2>
              <ol className="relative border-l border-[#1A1715]/10 ml-3 space-y-8">
                {order.statusHistory.map((s, idx) => (
                  <li key={idx} className="ml-6">
                    <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-[#b33a3a] ring-4 ring-[#FCFAF5]" />
                    <p className="text-sm font-bold text-[#1A1715] capitalize">{s.status}</p>
                    <p className="text-xs font-sans text-[#1A1715]/50 mt-1">
                      {new Date(s.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      {s.note ? ` — ${s.note}` : ''}
                    </p>
                  </li>
                ))}
              </ol>

              {canCancel && (
                <div className="mt-10 pt-6 border-t border-[#1A1715]/10">
                  <button onClick={cancel} className="w-full sm:w-auto bg-transparent border border-[#b33a3a]/30 text-[#b33a3a] px-6 py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#b33a3a]/5 transition-colors">
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Shipping & Payment */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 sticky top-24"
          >
            {/* Shipping Card */}
            <div className="bg-[#EBE4D8]/50 border border-[#1A1715]/5 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-[#1A1715]/40" />
                <h2 className="font-serif text-xl text-[#1A1715]">Shipping Details</h2>
              </div>
              <p className="text-sm font-medium text-[#1A1715]">{order.shippingAddress.fullName}</p>
              <p className="text-sm font-sans text-[#1A1715]/70 mt-2">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p className="text-sm font-sans text-[#1A1715]/70">{order.shippingAddress.line2}</p>}
              <p className="text-sm font-sans text-[#1A1715]/70">
                {order.shippingAddress.city}, {order.shippingAddress.state} — <span className="font-medium">{order.shippingAddress.pincode}</span>
              </p>
              <p className="mt-4 text-sm font-sans text-[#1A1715]/70 flex items-center gap-2">
                <span className="font-bold text-[#1A1715]">Phone:</span> {order.shippingAddress.phone}
              </p>
            </div>

            {/* Payment Card */}
            <div className="bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={20} className="text-[#1A1715]/40" />
                <h2 className="font-serif text-xl text-[#1A1715]">Payment Summary</h2>
              </div>
              
              <div className="mt-2 inline-flex items-center gap-2 bg-[#EBE4D8] px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase text-[#1A1715]/70 mb-6">
                {order.paymentMethod} · {order.paymentStatus}
              </div>

              <div className="space-y-3 text-sm font-sans">
                <Row label="Subtotal" value={formatINR(order.subtotal)} />
                <Row label="Shipping" value={order.shipping === 0 ? 'FREE' : formatINR(order.shipping)} />
                {order.discount > 0 && <Row label="Discount" value={`−${formatINR(order.discount)}`} accent="red" />}
                <div className="border-t border-[#1A1715]/10 pt-3 mt-3 flex justify-between items-center">
                  <span className="font-serif text-lg text-[#1A1715]">Total</span>
                  <span className="font-serif text-xl text-[#1A1715]">{formatINR(order.total)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between text-[#1A1715]/70">
      <span>{label}</span>
      <span className={accent === 'red' ? 'text-[#b33a3a] font-medium' : 'font-medium'}>{value}</span>
    </div>
  );
}