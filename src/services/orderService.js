// src/services/orderService.js
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'nursury_orders';

export const orderService = {
  /**
   * Place an order
   */
  async createOrder({
    cartItems,
    shippingAddress,
    paymentMethod = 'UPI',
    subtotal,
    deliveryFee = 0,
    finalTotal,
    user
  }) {
    if (isSupabaseConfigured() && supabase && user) {
      try {
        // Attempt secure RPC first (atomic price validation + inventory decrement)
        const rpcPayload = {
          p_items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          p_shipping_address: shippingAddress,
          p_payment_method: paymentMethod,
          p_delivery_fee: deliveryFee
        };

        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'create_order_secure',
          rpcPayload
        );

        if (!rpcError && rpcData) {
          return { data: rpcData, error: null, source: 'supabase_rpc' };
        }

        // Direct table insert fallback if RPC isn't deployed yet
        const orderNumber = `NUR-${Math.floor(10000 + Math.random() * 90000)}`;
        const { data: orderRow, error: orderErr } = await supabase
          .from('orders')
          .insert([
            {
              order_number: orderNumber,
              customer_id: user.id,
              customer_name: shippingAddress.fullName || user.user_metadata?.full_name || 'Customer',
              customer_email: user.email,
              status: 'Confirmed',
              subtotal,
              delivery_fee: deliveryFee,
              discount: 0,
              total_amount: finalTotal,
              payment_method: paymentMethod,
              payment_status: 'Pending',
              shipping_address: shippingAddress
            }
          ])
          .select()
          .single();

        if (orderErr) throw orderErr;

        // Insert order items
        const itemRows = cartItems.map((item) => ({
          order_id: orderRow.id,
          product_id: item.productId?.startsWith('prod-') ? null : item.productId,
          product_name: item.product.name,
          product_slug: item.product.slug,
          unit_price: item.product.price,
          quantity: item.quantity,
          line_total: item.totalPrice,
          image_url: item.product.image
        }));

        const { error: itemsErr } = await supabase.from('order_items').insert(itemRows);
        if (itemsErr) console.warn('[orderService] order_items insert warning:', itemsErr);

        return {
          data: {
            id: orderRow.id,
            orderNumber: orderRow.order_number,
            status: orderRow.status,
            totalAmount: orderRow.total_amount,
            items: cartItems
          },
          error: null,
          source: 'supabase'
        };
      } catch (err) {
        console.warn('[orderService] Supabase order failed, using local storage:', err.message);
      }
    }

    // Local Storage fallback
    const localOrders = loadFromStorage(STORAGE_KEY, []);
    const orderNumber = `NUR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderNumber,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        quantity: item.quantity,
        total: item.totalPrice,
        image: item.product.image,
        category: item.product.category
      })),
      pricing: {
        subtotal,
        deliveryFee,
        discount: 0,
        total: finalTotal
      },
      shippingAddress: { ...shippingAddress }
    };

    saveToStorage(STORAGE_KEY, [newOrder, ...localOrders]);
    return { data: newOrder, error: null, source: 'local' };
  },

  /**
   * Fetch orders for current authenticated customer
   */
  async getCustomerOrders(customerId) {
    if (isSupabaseConfigured() && supabase && customerId) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          const formatted = data.map((o) => ({
            id: o.order_number || o.id,
            dbId: o.id,
            createdAt: o.created_at,
            status: o.status,
            paymentMethod: o.payment_method,
            pricing: {
              subtotal: Number(o.subtotal),
              deliveryFee: Number(o.delivery_fee),
              discount: Number(o.discount),
              total: Number(o.total_amount)
            },
            shippingAddress: o.shipping_address,
            items: (o.order_items || []).map((i) => ({
              productId: i.product_id,
              name: i.product_name,
              slug: i.product_slug,
              price: Number(i.unit_price),
              quantity: i.quantity,
              total: Number(i.line_total),
              image: i.image_url
            }))
          }));
          return { data: formatted, error: null, source: 'supabase' };
        }
      } catch (err) {
        console.warn('[orderService] Supabase getCustomerOrders failed:', err.message);
      }
    }

    const localOrders = loadFromStorage(STORAGE_KEY, []);
    return { data: localOrders, error: null, source: 'local' };
  },

  /**
   * Fetch all orders (Admin only)
   */
  async getAllOrders() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          const formatted = data.map((o) => ({
            id: o.order_number || o.id,
            dbId: o.id,
            createdAt: o.created_at,
            status: o.status,
            customerName: o.customer_name,
            customerEmail: o.customer_email,
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            pricing: {
              subtotal: Number(o.subtotal),
              deliveryFee: Number(o.delivery_fee),
              discount: Number(o.discount),
              total: Number(o.total_amount)
            },
            shippingAddress: o.shipping_address,
            items: (o.order_items || []).map((i) => ({
              productId: i.product_id,
              name: i.product_name,
              slug: i.product_slug,
              price: Number(i.unit_price),
              quantity: i.quantity,
              total: Number(i.line_total),
              image: i.image_url
            }))
          }));
          return { data: formatted, error: null, source: 'supabase' };
        }
      } catch (err) {
        console.warn('[orderService] Supabase getAllOrders failed:', err.message);
      }
    }

    const localOrders = loadFromStorage(STORAGE_KEY, []);
    return { data: localOrders, error: null, source: 'local' };
  },

  /**
   * Update order status (Admin only)
   */
  async updateOrderStatus(orderId, newStatus) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .or(`id.eq.${orderId},order_number.eq.${orderId}`)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err.message };
      }
    }

    // Local fallback
    const localOrders = loadFromStorage(STORAGE_KEY, []);
    const updated = localOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    saveToStorage(STORAGE_KEY, updated);
    return { data: updated.find((o) => o.id === orderId), error: null };
  }
};
