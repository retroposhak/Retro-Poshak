import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';

const CartContext = createContext(null);
const LS_KEY = 'retroPoshakGuestCart';

const FREE_SHIPPING = 1499;
const FLAT_SHIPPING = 79;

function computeGuestTotals(items) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING ? 0 : FLAT_SHIPPING;
  return { subtotal, shipping, discount: 0, total: subtotal + shipping };
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [totals, setTotals] = useState(computeGuestTotals([]));
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setTotals(computeGuestTotals(items));
      setLoading(false);
      return;
    }
    try {
      const data = await cartService.get();
      setItems(data.items || []);
      setTotals(data.totals || computeGuestTotals([]));
    } catch (e) {
      console.error('Cart refresh failed', e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, items]);

  // Hydrate on auth change
  useEffect(() => {
    let alive = true;
    (async () => {
      if (isAuthenticated) {
        // Merge guest cart into server once
        const guest = items
          .map((i) => ({
            productId: i.productId,
            size: i.size,
            colour: i.colour,
            quantity: i.quantity,
          }))
          .filter((i) => i.productId);
        if (guest.length) {
          try {
            await cartService.merge(guest);
            localStorage.removeItem(LS_KEY);
          } catch (e) {
            console.warn('Cart merge failed', e);
          }
        }
      }
      if (alive) await refresh();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Persist guest cart
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const add = useCallback(
    async ({ product, size, colour, quantity = 1 }) => {
      if (isAuthenticated) {
        const data = await cartService.add({
          productId: product.id,
          size,
          colour,
          quantity,
        });
        setItems(data.items);
        setTotals(data.totals);
        return;
      }
      // Guest
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.productId === product.id && i.size === size && i.colour === colour
        );
        if (idx > -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [
          ...prev,
          {
            productId: product.id,
            size,
            colour,
            quantity,
            price: product.price,
            product: {
              _id: product.id,
              name: product.name,
              image: product.images?.[0],
              images: product.images,
            },
            lineTotal: product.price * quantity,
          },
        ];
      });
    },
    [isAuthenticated]
  );

  const update = useCallback(
    async ({ productId, size, colour, quantity }) => {
      if (isAuthenticated) {
        const data = await cartService.update({ productId, size, colour, quantity });
        setItems(data.items);
        setTotals(data.totals);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size && i.colour === colour
            ? { ...i, quantity, lineTotal: i.price * quantity }
            : i
        )
      );
    },
    [isAuthenticated]
  );

  const remove = useCallback(
    async ({ productId, size, colour }) => {
      if (isAuthenticated) {
        const data = await cartService.remove({ productId, size, colour });
        setItems(data.items);
        setTotals(data.totals);
        return;
      }
      setItems((prev) =>
        prev.filter(
          (i) => !(i.productId === productId && i.size === size && i.colour === colour)
        )
      );
    },
    [isAuthenticated]
  );

  const clear = useCallback(async () => {
    if (isAuthenticated) {
      const data = await cartService.clear();
      setItems(data.items);
      setTotals(data.totals);
    } else {
      setItems([]);
      setTotals(computeGuestTotals([]));
    }
  }, [isAuthenticated]);

  // Recompute guest totals whenever items change
  useEffect(() => {
    if (!isAuthenticated) setTotals(computeGuestTotals(items));
  }, [items, isAuthenticated]);

  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totals, count, loading, add, update, remove, clear, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}