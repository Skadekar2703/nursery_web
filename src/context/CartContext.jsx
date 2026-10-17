// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { PRODUCTS, MOCK_PRICING } from '../data/products';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useToast } from './ToastContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'nursury_cart';
const COUPON_KEY = 'nursury_coupon';

function deduplicateCartItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];
  const map = new Map();
  for (const item of rawItems) {
    if (!item || !item.productId) continue;
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    if (map.has(item.productId)) {
      map.set(item.productId, map.get(item.productId) + qty);
    } else {
      map.set(item.productId, qty);
    }
  }
  return Array.from(map.entries()).map(([productId, quantity]) => ({
    productId,
    quantity
  }));
}

export function CartProvider({ children }) {
  const { addToast } = useToast();
  const [items, setItems] = useState(() => {
    const stored = loadFromStorage(STORAGE_KEY, [
      { productId: 'prod-01', quantity: 1 }
    ]);
    return deduplicateCartItems(stored);
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    return loadFromStorage(COUPON_KEY, null);
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEY, items);
  }, [items]);

  useEffect(() => {
    saveToStorage(COUPON_KEY, appliedCoupon);
  }, [appliedCoupon]);

  const cartItems = useMemo(() => {
    return items
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          totalPrice: product.price * item.quantity
        };
      })
      .filter(Boolean);
  }, [items]);

  const cartCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= MOCK_PRICING.freeDeliveryThreshold ? 0 : MOCK_PRICING.standardDeliveryFee;
  }, [subtotal]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    return Math.round((subtotal * appliedCoupon.percent) / 100);
  }, [appliedCoupon, subtotal]);

  const finalTotal = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - discountAmount + deliveryFee);
  }, [subtotal, discountAmount, deliveryFee]);

  const getItemQuantity = useCallback(
    (productId) => {
      const item = items.find((i) => i.productId === productId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  const addToCart = (productId, quantity = 1, showNotification = true) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const validQty = Math.max(1, parseInt(quantity, 10) || 1);

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === productId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + validQty
        };
        return next;
      } else {
        return [...prev, { productId, quantity: validQty }];
      }
    });

    if (showNotification) {
      addToast(`Added ${product.name} to your basket!`, 'success');
    }
  };

  const updateQuantity = (productId, newQuantity, showNotification = true) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId, showNotification);
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (productId, showNotification = true) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setItems((prev) => prev.filter((item) => item.productId !== productId));

    if (showNotification && product) {
      addToast(`Removed ${product.name} from basket`, 'info');
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === MOCK_PRICING.sampleDiscountCode) {
      setAppliedCoupon({
        code: cleanCode,
        percent: MOCK_PRICING.sampleDiscountPercent
      });
      addToast(`Promo code applied: ${MOCK_PRICING.sampleDiscountPercent}% OFF!`, 'success');
      return { success: true };
    } else {
      addToast('Invalid promo code. Try NURSURY10', 'error');
      return { success: false, message: 'Invalid promo code. Try NURSURY10' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Promo coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartItems,
        cartCount,
        subtotal,
        deliveryFee,
        discountAmount,
        finalTotal,
        appliedCoupon,
        freeDeliveryThreshold: MOCK_PRICING.freeDeliveryThreshold,
        getItemQuantity,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
