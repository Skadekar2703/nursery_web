// src/context/OrderContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { orderService } from '../services/orderService';

const OrderContext = createContext(null);
const STORAGE_KEY = 'nursury_orders';

const INITIAL_ORDERS = [
  {
    id: 'NUR-74291',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Delivered',
    paymentMethod: 'UPI — Demo (Google Pay / PhonePe)',
    items: [
      {
        productId: 'prod-01',
        name: 'Monstera Deliciosa',
        slug: 'monstera-deliciosa',
        price: 699,
        quantity: 1,
        total: 699,
        image: '/images/onboarding_plant.jpg',
        category: 'Indoor Plants'
      },
      {
        productId: 'prod-02',
        name: 'Snake Plant',
        slug: 'snake-plant',
        price: 449,
        quantity: 1,
        total: 449,
        image: '/images/plant_snake.jpg',
        category: 'Indoor Plants'
      }
    ],
    pricing: {
      subtotal: 1148,
      deliveryFee: 0,
      discount: 0,
      total: 1148
    },
    shippingAddress: {
      fullName: 'Aarav Sharma',
      phone: '9876543210',
      house: 'Flat 402, Green Meadows',
      street: 'Indiranagar 100ft Road',
      landmark: 'Near Botanical Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    }
  }
];

export function OrderProvider({ children }) {
  const { clearCart } = useCart();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [orders, setOrders] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEY, INITIAL_ORDERS);
    return Array.isArray(saved) ? saved : INITIAL_ORDERS;
  });

  // Sync orders with Supabase if logged in
  useEffect(() => {
    let mounted = true;
    if (user?.id) {
      orderService.getCustomerOrders(user.id).then((res) => {
        if (mounted && res.data && res.data.length > 0) {
          setOrders(res.data);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, orders);
  }, [orders]);

  const placeOrder = async ({
    cartItems,
    subtotal,
    deliveryFee,
    discountAmount,
    finalTotal,
    address,
    paymentMethod
  }) => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const fallbackOrderId = `NUR-${randomDigits}`;

    const snapshotItems = cartItems.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      quantity: item.quantity,
      total: item.totalPrice,
      image: item.product.image,
      category: item.product.category
    }));

    const localOrder = {
      id: fallbackOrderId,
      orderNumber: fallbackOrderId,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      paymentMethod,
      items: snapshotItems,
      pricing: {
        subtotal,
        deliveryFee,
        discount: discountAmount,
        total: finalTotal
      },
      shippingAddress: { ...address }
    };

    // Attempt remote save if user authenticated
    try {
      const res = await orderService.createOrder({
        cartItems,
        shippingAddress: address,
        paymentMethod,
        subtotal,
        deliveryFee,
        finalTotal,
        user
      });
      if (res.data?.orderNumber) {
        localOrder.id = res.data.orderNumber;
        localOrder.orderNumber = res.data.orderNumber;
      }
    } catch (e) {
      console.warn('Remote order creation failed, persisting locally:', e);
    }

    setOrders((prev) => [localOrder, ...prev]);
    clearCart();
    addToast(`Order ${localOrder.id} placed successfully!`, 'success');
    return localOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
  };

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: 'Cancelled' } : o))
    );
    addToast(`Order ${orderId} cancelled`, 'info');
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
        cancelOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return ctx;
}
