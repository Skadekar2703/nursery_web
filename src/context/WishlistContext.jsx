// src/context/WishlistContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'nursury_wishlist';

export function WishlistProvider({ children }) {
  const { addToast } = useToast();
  const { addToCart } = useCart();

  const [wishlistIds, setWishlistIds] = useState(() => {
    return loadFromStorage(STORAGE_KEY, ['prod-03', 'prod-11']);
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEY, wishlistIds);
  }, [wishlistIds]);

  const wishlistItems = useMemo(() => {
    return wishlistIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter(Boolean);
  }, [wishlistIds]);

  const wishlistCount = wishlistIds.length;

  const isInWishlist = (productId) => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    if (wishlistIds.includes(productId)) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      addToast(`Removed ${product.name} from wishlist`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      addToast(`Saved ${product.name} to your wishlist!`, 'success');
    }
  };

  const removeFromWishlist = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    if (product) {
      addToast(`Removed ${product.name} from wishlist`, 'info');
    }
  };

  const moveToCart = (productId) => {
    addToCart(productId, 1, false);
    removeFromWishlist(productId);
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      addToast(`Moved ${product.name} to basket!`, 'success');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return ctx;
}
