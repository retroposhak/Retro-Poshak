import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Truck, Tag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { couponService } from '../services/couponService';
import { formatINR } from '../utils/formatCurrency';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  return formattedPath.replace(/ /g, '%20');
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totals, refresh, clear } = useCart();
  const navigate = useNavigate();

  const [payment, setPayment] = useState('COD');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [applying, setApplying] = useState(false);
  const [placing, setPlacing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  // Load Razorpay SDK once
  useEffect(() => {
    if (document.getElementById('razorpay-sdk')) return;
    const s = document.createElement('script');
    s.id = 'razorpay-sdk';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // If cart empty → back
  useEffect(() => {
    if (!items || items.length === 0) {
      toast('Your cart is empty', { icon: '🛒' });
      navigate('/cart', { replace: true });
    }
  }, [items, navigate]);

  // Server-authoritative totals
  const discountedTotals = (() => {
    const couponDiscount = appliedCoupon?.discount || 0;
    const prepaidDiscount = payment === 'Prepaid'
      ? Math.round((totals.subtotal - couponDiscount) * 0.05)
      : 0;
    const totalDiscount = couponDiscount + prepaidDiscount;
    return {
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      discount: totalDiscount,
      total: Math.max(0, totals.subtotal + totals.shipping - totalDiscount),
      couponDiscount,
      prepaidDiscount,
    };
  })();

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplying(true);
    setCouponError('');
    try {
      const c = await couponService.validate(couponInput.trim(), totals.subtotal);
      setAppliedCoupon(c);
      toast.success(`Coupon applied — ${formatINR(c.discount)} off`);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid coupon';
      setCouponError(msg);
      setAppliedCoupon(null);
    } finally {
      setApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const onSubmit = async (formData) => {
    setPlacing(true);
    try {
      const shippingAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        line1: formData.line1,
        line2: formData.line2 || '',
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      const result = await orderService.place({
        shippingAddress,
        paymentMethod: payment,
        couponCode: appliedCoupon?.code || '',
      });

      if (!result.requiresPayment) {
        await refresh();
        navigate(`/order-success/${result.order.orderId}`, { replace: true });
        return;
      }

      await openRazorpay(result.order);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not place order';
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  const openRazorpay = async (order) => {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) {
      toast.error('Prepaid payments are not configured. Use COD.');
      return;
    }
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded yet — retry in a moment');
      return;
    }

    const rzpOrder = await paymentService.createRazorpayOrder(order.orderId);

    const options = {
      key: rzpOrder.keyId,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      name: 'Retro Poshak',
      description: `Order #${order.orderId}`,
      order_id: rzpOrder.id,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || '',
      },
      theme: { color: '#b33a3a' },
      handler: async (response) => {
        try {
          await paymentService.verify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          await refresh();
          navigate(`/order-success/${order.orderId}`, { replace: true });
        } catch (e) {
          toast.error('Payment verification failed — contact support with order ID ' + order.orderId);
        }
      },
      modal: {
        ondismiss: () => toast('Payment cancelled', { icon: '⚠️' }),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!items || items.length === 0) return null;

  return (
    <main className="bg-[#F7F3EC] min-h-screen py-16">
      <div className="container-page">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-5xl md:text-6xl text-[#1A1715]">Checkout<span className="text-[#b33a3a]">.</span></h1>
          <p className="mt-3 text-sm text-[#1A1715]/50 font-sans tracking-wide">Complete your details to place the order.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] xl:gap-16 items-start">
          
          {/* ═══════════ LEFT: CHECKOUT FORM ═══════════ */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-8"
          >
            
            {/* Shipping Address Section */}
            <div className="bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-[#1A1715]/10 pb-4">
                <Truck size={20} className="text-[#1A1715]/40" />
                <h2 className="font-serif text-xl text-[#1A1715]">Shipping Address</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input label="Full Name *" error={errors.fullName} {...register('fullName', { required: 'Required' })} />
                <Input label="Phone *" error={errors.phone} {...register('phone', { required: 'Required' })} />
                <Input className="sm:col-span-2" label="Email *" type="email" error={errors.email} {...register('email', { required: 'Required' })} />
                <Input className="sm:col-span-2" label="Address Line 1 *" placeholder="House no, Street, Area" error={errors.line1} {...register('line1', { required: 'Required' })} />
                <Input className="sm:col-span-2" label="Address Line 2" placeholder="Landmark (optional)" {...register('line2')} />
                <Input label="City *" error={errors.city} {...register('city', { required: 'Required' })} />
                <Input label="State *" error={errors.state} {...register('state', { required: 'Required' })} />
                <Input label="Pincode *" error={errors.pincode} {...register('pincode', { required: 'Required', pattern: { value: /^[0-9]{6}$/, message: '6 digits' } })} />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-[#1A1715]/10 pb-4">
                <CreditCard size={20} className="text-[#1A1715]/40" />
                <h2 className="font-serif text-xl text-[#1A1715]">Payment Method</h2>
              </div>
              
              <div className="space-y-4">
                <PayOption 
                  value="COD" 
                  current={payment} 
                  onChange={setPayment} 
                  title="Cash on Delivery" 
                  desc="Pay when you receive the order" 
                  icon={<Truck size={20} />}
                />
                <PayOption 
                  value="Prepaid" 
                  current={payment} 
                  onChange={setPayment} 
                  title="Prepaid (UPI / Card)" 
                  desc="Get 5% instant discount on prepaid orders" 
                  icon={<CreditCard size={20} />}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={placing} 
              className="w-full h-16 bg-[#1A1715] text-[#F7F3EC] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#b33a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-full shadow-lg"
            >
              {placing ? 'Processing...' : payment === 'Prepaid' ? 'Pay Securely' : 'Place Order'}
              {!placing && <ArrowRight size={16} />}
            </button>
          </motion.form>

          {/* ═══════════ RIGHT: ORDER SUMMARY ═══════════ */}
          <motion.aside 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#EBE4D8]/50 border border-[#1A1715]/10 rounded-3xl p-6 sm:p-8 sticky top-24"
          >
            <h2 className="font-serif text-2xl text-[#1A1715] border-b border-[#1A1715]/10 pb-4 mb-6">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto hide-scrollbar">
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}-${i.colour}`} className="flex gap-4">
                  <div className="h-16 w-14 shrink-0 rounded-xl overflow-hidden bg-[#F7F3EC] border border-[#1A1715]/5">
                    <img src={getImageUrl(i.product.image)} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <p className="font-serif text-base text-[#1A1715] truncate">{i.product.name}</p>
                    <p className="text-[11px] font-sans text-[#1A1715]/50 mt-1">Size: {i.size} · {i.colour} · Qty: {i.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="font-medium text-sm text-[#1A1715]">{formatINR(i.price * i.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="border-t border-[#1A1715]/10 pt-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-[#1A1715]/50" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1A1715]">Promo Code</h3>
              </div>
              
              <AnimatePresence mode="wait">
                {appliedCoupon ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between bg-[#2c7a4a]/10 border border-[#2c7a4a]/20 p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-[#2c7a4a]">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-medium">{appliedCoupon.code} (−{formatINR(appliedCoupon.discount)})</span>
                    </div>
                    <button type="button" onClick={removeCoupon} className="text-xs text-[#2c7a4a]/70 hover:text-[#2c7a4a] font-bold uppercase tracking-wider">
                      Remove
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2"
                  >
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 bg-[#F7F3EC] border border-[#1A1715]/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#1A1715] uppercase placeholder:text-[#1A1715]/40 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={applying}
                      className="bg-[#1A1715] text-[#F7F3EC] px-6 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#b33a3a] transition-colors disabled:opacity-50"
                    >
                      {applying ? '...' : 'Apply'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {couponError && <p className="mt-2 text-xs text-[#b33a3a]">{couponError}</p>}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-[#1A1715]/10 pt-6 text-sm font-sans">
              <Row label="Subtotal" value={formatINR(discountedTotals.subtotal)} />
              <Row label="Shipping" value={discountedTotals.shipping === 0 ? 'FREE' : formatINR(discountedTotals.shipping)} />
              
              {discountedTotals.couponDiscount > 0 && (
                <Row label="Coupon Discount" value={`−${formatINR(discountedTotals.couponDiscount)}`} accent="red" />
              )}
              {discountedTotals.prepaidDiscount > 0 && (
                <Row label="Prepaid Discount (5%)" value={`−${formatINR(discountedTotals.prepaidDiscount)}`} accent="red" />
              )}
              
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#1A1715]/10">
                <span className="font-serif text-xl text-[#1A1715]">Total</span>
                <span className="font-serif text-2xl text-[#1A1715]">{formatINR(discountedTotals.total)}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#1A1715]/40 uppercase tracking-wider font-bold">
              <ShieldCheck size={14} /> Secure 256-bit SSL Checkout
            </div>
          </motion.aside>

        </div>
      </div>
    </main>
  );
}

function Input({ label, error, className = '', ...rest }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#1A1715]">
        {label}
      </label>
      <input 
        className={`w-full bg-[#F7F3EC] border ${error ? 'border-[#b33a3a]' : 'border-[#1A1715]/15'} rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1A1715] transition-colors placeholder:text-[#1A1715]/30 text-[#1A1715] font-medium`} 
        {...rest} 
      />
      {error && <p className="mt-1.5 text-[11px] text-[#b33a3a]">{error.message || 'Required'}</p>}
    </div>
  );
}

function PayOption({ value, current, onChange, title, desc, icon }) {
  const isActive = current === value;
  return (
    <label 
      className={`flex cursor-pointer items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
        isActive 
          ? 'border-[#1A1715] bg-[#F7F3EC] shadow-md scale-[1.01]' 
          : 'border-[#1A1715]/15 bg-transparent hover:border-[#1A1715]/30'
      }`}
    >
      <div className="mt-0.5">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          isActive ? 'border-[#1A1715] bg-[#1A1715]' : 'border-[#1A1715]/30'
        }`}>
          {isActive && <div className="w-2 h-2 rounded-full bg-[#F7F3EC]" />}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-[#1A1715] ${isActive ? 'font-bold' : 'font-medium'}`}>{title}</span>
        </div>
        <p className="text-xs text-[#1A1715]/50 mt-1 font-sans">{desc}</p>
      </div>
      
      <div className={`text-[#1A1715]/40 ${isActive ? 'text-[#1A1715]' : ''}`}>
        {icon}
      </div>
      
      <input 
        type="radio" 
        name="payment" 
        value={value} 
        checked={isActive} 
        onChange={() => onChange(value)} 
        className="hidden" 
      />
    </label>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between text-[#1A1715]/70">
      <span>{label}</span>
      <span className={accent === 'red' ? 'text-[#b33a3a] font-medium' : 'font-medium text-[#1A1715]'}>{value}</span>
    </div>
  );
}