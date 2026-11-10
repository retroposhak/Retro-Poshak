import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { wishlistService } from '../services/wishlistService';

const WishlistContext = createContext(null);
const LS_KEY = 'retroPoshakWishlist';

export function WishlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from server when logged in, and merge localStorage ids once
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isAuthenticated) {
        setHydrated(true);
        return;
      }
      try {
        const guestIds = ids.filter(Boolean);
        if (guestIds.length) {
          await wishlistService.merge(guestIds);
          localStorage.removeItem(LS_KEY);
        }
        const data = await wishlistService.get();
        if (alive) setIds(data.productIds || []);
      } catch (e) {
        console.warn('Wishlist hydrate failed', e);
      } finally {
        if (alive) setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  // Persist to localStorage in guest mode
  useEffect(() => {
    if (!isAuthenticated && hydrated) {
      localStorage.setItem(LS_KEY, JSON.stringify(ids));
    }
  }, [ids, isAuthenticated, hydrated]);

  const isWishlisted = useCallback((id) => ids.includes(String(id)), [ids]);

  const toggle = useCallback(
    async (id) => {
      const sid = String(id);
      const has = ids.includes(sid);
      // Optimistic update
      setIds((prev) => (has ? prev.filter((x) => x !== sid) : [...prev, sid]));

      if (!isAuthenticated) return !has; // guest — local only

      try {
        const data = has
          ? await wishlistService.remove(sid)
          : await wishlistService.add(sid);
        setIds(data.productIds || []);
        return !has;
      } catch (e) {
        // revert
        setIds((prev) => (has ? [...prev, sid] : prev.filter((x) => x !== sid)));
        console.error('Wishlist toggle failed', e);
        return has;
      }
    },
    [ids, isAuthenticated]
  );

  return (
    <WishlistContext.Provider value={{ ids, count: ids.length, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}