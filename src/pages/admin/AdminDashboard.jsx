import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  FolderTree,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Plus,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatINR } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export function AdminDashboard() {
  const { configured } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    adminService
      .getDashboardStats()
      .then((data) => {
        if (mounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error('Error fetching admin dashboard stats:', err);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchStats();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <h1>Command Dashboard</h1>
          <p>Real-time overview of botanical inventory, customer orders, and store performance.</p>
        </div>

        <div className="admin-actions">
          <button
            type="button"
            onClick={handleRefresh}
            className="btn btn-secondary btn-sm"
            disabled={loading}
            title="Refresh dashboard metrics"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <Link to="/admin/products/add" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add New Plant</span>
          </Link>
        </div>
      </div>

      {/* Supabase Connection Advisory Banner */}
      {!configured ? (
        <div
          style={{
            backgroundColor: '#FEF7E0',
            border: '1px solid #FEEFC3',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <AlertTriangle size={22} color="#B06000" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#B06000', fontSize: '0.95rem' }}>
                Local Demonstration Mode (Supabase URL pending)
              </div>
              <div style={{ fontSize: '0.85rem', color: '#5A4200', marginTop: '0.2rem' }}>
                The dashboard is running with responsive local fallback storage. Once you paste your{' '}
                <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in{' '}
                <code>.env</code>, all metrics and records will switch automatically to PostgreSQL with Row Level Security.
              </div>
            </div>
          </div>
          <Link to="/admin/settings" className="btn btn-sm" style={{ backgroundColor: '#B06000', color: '#FFF' }}>
            Setup Supabase
          </Link>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#E6F4EA',
            border: '1px solid #CEEAD6',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#137333',
            fontSize: '0.875rem'
          }}
        >
          <CheckCircle2 size={18} />
          <span>
            Connected to <strong>Supabase PostgreSQL</strong> with Row Level Security enforcement.
          </span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="admin-stats-grid">
        {/* Total Products */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{loading ? '—' : stats?.totalProducts || 0}</div>
            <div className="stat-subtext">
              {stats?.activeProducts || 0} Active • {stats?.inactiveProducts || 0} Inactive
            </div>
          </div>
          <div className="admin-stat-icon" style={{ backgroundColor: 'var(--color-soft-sage)' }}>
            <Sprout size={24} color="var(--color-primary-green)" />
          </div>
        </div>

        {/* Categories */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <div className="stat-label">Categories</div>
            <div className="stat-value">{loading ? '—' : stats?.totalCategories || 0}</div>
            <div className="stat-subtext">Botanical collections</div>
          </div>
          <div className="admin-stat-icon" style={{ backgroundColor: '#EBF4F6' }}>
            <FolderTree size={24} color="#1D6F8A" />
          </div>
        </div>

        {/* Orders */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <div className="stat-label">Orders Processed</div>
            <div className="stat-value">{loading ? '—' : stats?.totalOrders || 0}</div>
            <div className="stat-subtext">Total store purchases</div>
          </div>
          <div className="admin-stat-icon" style={{ backgroundColor: '#FBF1D5' }}>
            <ShoppingBag size={24} color="#8E6316" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <div className="stat-label">Total Volume</div>
            <div className="stat-value">
              {loading ? '—' : formatINR(stats?.totalRevenue || 0)}
            </div>
            <div className="stat-subtext">Gross sales recorded</div>
          </div>
          <div className="admin-stat-icon" style={{ backgroundColor: '#E6F4EA' }}>
            <TrendingUp size={24} color="#137333" />
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <div className="stat-label">Low Stock Alerts</div>
            <div className="stat-value" style={{ color: stats?.lowStockCount > 0 ? 'var(--color-error)' : 'inherit' }}>
              {loading ? '—' : stats?.lowStockCount || 0}
            </div>
            <div className="stat-subtext">Items with ≤ 5 units left</div>
          </div>
          <div
            className="admin-stat-icon"
            style={{
              backgroundColor: stats?.lowStockCount > 0 ? '#FDF3F2' : '#F1F3F4',
              color: stats?.lowStockCount > 0 ? 'var(--color-error)' : '#5F6368'
            }}
          >
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Low Stock & Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.75rem' }}>
        {/* Low Stock Alert Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Low Stock Alert</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginTop: '0.2rem' }}>
                Plants requiring prompt re-potting or nursery nursery restocking
              </p>
            </div>
            <Link to="/admin/products" className="btn btn-ghost btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Plant</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                      Checking inventory levels...
                    </td>
                  </tr>
                ) : stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                  stats.lowStockProducts.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <div className="admin-product-cell">
                          <img
                            src={prod.image || prod.imageUrl || '/images/onboarding_plant.jpg'}
                            alt={prod.name}
                            className="admin-product-thumb"
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{prod.name}</div>
                            <div style={{ fontSize: '0.775rem', color: 'var(--color-secondary-text)' }}>
                              {formatINR(prod.price)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{prod.category}</td>
                      <td>
                        <span className={`admin-badge ${prod.stockQuantity === 0 ? 'danger' : 'warning'}`}>
                          {prod.stockQuantity === 0 ? 'Out of Stock' : `${prod.stockQuantity} units`}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/admin/products/edit/${prod.id}`}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                        >
                          Restock
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-secondary-text)' }}>
                      🌿 All botanical products have healthy inventory levels!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Recent Orders</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginTop: '0.2rem' }}>
                Latest transactions placed by customers
              </p>
            </div>
            <Link to="/admin/orders" className="btn btn-ghost btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                      Loading orders...
                    </td>
                  </tr>
                ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary-green)' }}>
                          {order.id}
                        </span>
                        <div style={{ fontSize: '0.725rem', color: 'var(--color-secondary-text)' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>
                          {order.customerName || order.shippingAddress?.fullName || 'Customer'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                          {order.items?.length || 1} items
                        </div>
                      </td>
                      <td>
                        <span
                          className={`admin-badge ${
                            order.status === 'Delivered'
                              ? 'success'
                              : order.status === 'Cancelled'
                              ? 'danger'
                              : order.status === 'Shipped'
                              ? 'info'
                              : 'warning'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {formatINR(order.pricing?.total || order.total_amount || 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-secondary-text)' }}>
                      No orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
