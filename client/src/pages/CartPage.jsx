import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';

export default function CartPage() {
  const { items, totals, count, loading, update, remove, clear } = useCart();

  const handleQty = async (item, q) => {
    try {
      await update({ productId: item.productId, size: item.size, colour: item.colour, quantity: q });
    } catch (e) {
      toast.error('Could not update quantity');
    }
  };
  const handleRemove = async (item) => {
    try {
      await remove({ productId: item.productId, size: item.size, colour: item.colour });
      toast.success('Removed from bag');
    } catch {
      toast.error('Could not remove item');
    }
  };
  const handleClear = async () => {
    if (!confirm('Remove all items from your bag?')) return;
    await clear();
    toast.success('Bag cleared');
  };

  if (loading) {
    return (
      <main className="container-page py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-48 rounded-full bg-[#EBE4D8]" />
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-36 rounded-2xl bg-[#EBE4D8]" />
              ))}
            </div>
            <div className="h-80 rounded-2xl bg-[#EBE4D8]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F7F3EC] min-h-screen py-16">
      <div className="container-page">
        
        {/* Header */}
        <div className="flex items-end justify-between border-b border-[#1A1715]/10 pb-6 mb-10">
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#b33a3a] block mb-2">Your Bag</span>
            <h1 className="font-serif text-5xl md:text-6xl text-[#1A1715]">Cart<span className="text-[#b33a3a]">.</span></h1>
            <p className="mt-3 text-sm text-[#1A1715]/50 font-sans tracking-wide">
              {count === 0 ? 'Your bag is empty.' : `${count} item${count === 1 ? '' : 's'} ready for checkout.`}
            </p>
          </div>
          {items.length > 0 && (
            <button onClick={handleClear} className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#1A1715]/50 hover:text-[#b33a3a] transition-colors">
              Clear bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon="🛍️"
            title="Your bag is empty"
            description="Add a story to your bag and come back."
            ctaLabel="Start Shopping"
            ctaHref="/shop"
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] items-start">
            
            {/* Left: Items List with stagger animation */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="bg-[#FCFAF5] border border-[#1A1715]/5 rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.size}-${item.colour}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                  >
                    <CartItem
                      item={item}
                      onQty={handleQty}
                      onRemove={handleRemove}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Right: Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CartSummary totals={totals} itemCount={count} />
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}