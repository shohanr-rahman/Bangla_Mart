"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type WishlistItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
};

type WishlistContextType = {
  items: WishlistItem[];
  count: number;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "bangla-mart-wishlist";

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, ready]);

  const isWishlisted = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items]
  );

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setItems((current) => {
      const exists = current.some((product) => product.id === item.id);

      if (exists) {
        return current.filter((product) => product.id !== item.id);
      }

      return [...current, item];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
    }),
    [items, isWishlisted, toggleWishlist, removeFromWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}