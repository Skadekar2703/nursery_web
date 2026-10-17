// src/services/adminService.js
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { productService } from './productService';
import { categoryService } from './categoryService';
import { orderService } from './orderService';

export const adminService = {
  /**
   * Check if a user ID is an admin
   */
  async checkAdminRole(userId) {
    if (!userId) return false;
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.warn('[adminService] checkAdminRole error:', error.message);
          return false;
        }
        return !!data;
      } catch (err) {
        console.warn('[adminService] checkAdminRole failed:', err.message);
        return false;
      }
    }
    // In local demo mode, check demo storage
    const demoRole = localStorage.getItem('nursury_demo_role');
    return demoRole === 'admin';
  },

  /**
   * Gather overview KPIs and stats for Admin Dashboard
   */
  async getDashboardStats() {
    // 1. Fetch Products
    const { data: products } = await productService.getProducts({ activeOnly: false });
    const totalProducts = products ? products.length : 0;
    const activeProducts = products ? products.filter((p) => p.is_active !== false).length : 0;
    const lowStockProducts = products ? products.filter((p) => (p.stockQuantity || p.stock_quantity || 0) <= 5) : [];

    // 2. Fetch Categories
    const { data: categories } = await categoryService.getCategories({ activeOnly: false });
    const totalCategories = categories ? categories.length : 0;

    // 3. Fetch Orders
    const { data: orders } = await orderService.getAllOrders();
    const totalOrders = orders ? orders.length : 0;
    const totalRevenue = (orders || []).reduce(
      (sum, o) => sum + (o.pricing?.total || o.total_amount || 0),
      0
    );
    const recentOrders = (orders || []).slice(0, 5);

    // 4. Customers count
    let totalCustomers = 1;
    if (isSupabaseConfigured() && supabase) {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) {
          totalCustomers = count;
        }
      } catch (err) {
        console.warn('[adminService] fetch customers count error:', err);
      }
    }

    return {
      totalProducts,
      activeProducts,
      inactiveProducts: totalProducts - activeProducts,
      totalCategories,
      totalOrders,
      totalCustomers,
      totalRevenue,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 6),
      recentOrders
    };
  },

  /**
   * Fetch customer list for admin
   */
  async getCustomers() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) return { data, error: null };
      } catch (err) {
        console.warn('[adminService] getCustomers failed:', err.message);
      }
    }

    // Local simulated customer list
    const mockCustomers = [
      {
        id: 'cust-demo-1',
        full_name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        phone: '+91 98765 43210',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        order_count: 2,
        total_spent: 1847
      },
      {
        id: 'cust-demo-2',
        full_name: 'Priya Patel',
        email: 'priya.patel@example.com',
        phone: '+91 98123 45678',
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        order_count: 1,
        total_spent: 899
      },
      {
        id: 'cust-demo-3',
        full_name: 'Rohan Deshmukh',
        email: 'rohan.d@example.com',
        phone: '+91 97456 12389',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        order_count: 3,
        total_spent: 2499
      }
    ];

    return { data: mockCustomers, error: null };
  }
};
