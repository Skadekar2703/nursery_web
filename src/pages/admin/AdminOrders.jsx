import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Eye,
  RefreshCw,
  X,
  MapPin,
  CreditCard
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatINR } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const ORDER_STATUSES = ['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function AdminOrders() {
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const res = await orderService.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    let mounted = true;
    orderService
      .getAllOrders()
      .then((res) => {
        if (mounted) {
          setOrders(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error('Failed to load orders:', err);
          addToast('Failed to load orders', 'error');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [addToast]);

  const handleRefresh = async () => {
    setLoading(true);
    await loadOrders();
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerEmail?.toLowerCase().includes(q) ||
          o.shippingAddress?.fullName?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((o) => o.status === statusFilter);
    }

    return result;
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    const res = await orderService.updateOrderStatus(orderId, newStatus);
    setUpdatingStatus(false);

    if (res.data) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
      addToast(`Order ${orderId} status set to "${newStatus}"`, 'success');
    } else {
      addToast(res.error || 'Failed to update order status', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <h1>Customer Orders Fulfillment</h1>
          <p>Review customer orders, dispatch botanical packages, and update delivery statuses.</p>
        </div>

        <div className="admin-actions">
          <button
            type="button"
            onClick={handleRefresh}
            className="btn btn-secondary btn-sm"
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="admin-card">
        {/* Filters */}
        <div className="admin-filters-bar">
          <div className="admin-search-box">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items Summary</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading customer orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const itemsCount = (order.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0);
                  const total = order.pricing?.total || order.total_amount || 0;

                  return (
                    <tr key={order.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary-green)' }}>
                          {order.id}
                        </span>
                      </td>

                      <td style={{ fontSize: '0.825rem', color: 'var(--color-secondary-text)' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {order.customerName || order.shippingAddress?.fullName || 'Customer'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                          {order.customerEmail || '—'}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.85rem' }}>
                          {itemsCount} plant{itemsCount !== 1 ? 's' : ''}
                        </span>
                      </td>

                      <td style={{ fontWeight: 700 }}>{formatINR(total)}</td>

                      <td>
                        <select
                          value={order.status}
                          disabled={updatingStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="form-select"
                          style={{
                            width: 'auto',
                            padding: '0.25rem 0.5rem',
                            height: '32px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor:
                              order.status === 'Delivered'
                                ? '#E6F4EA'
                                : order.status === 'Cancelled'
                                ? '#FDF3F2'
                                : order.status === 'Shipped'
                                ? '#E8F0FE'
                                : '#FEF7E0'
                          }}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem' }}>
                    No orders match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '680px' }}>
            <div className="admin-modal-header">
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-secondary-text)', fontWeight: 700 }}>
                  Order Invoice & Packaging Slip
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-dark-green)', margin: '0.2rem 0 0' }}>
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="btn btn-ghost btn-sm"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Status and Timestamp */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: '#F8FAF7',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Order Date</div>
                  <div style={{ fontWeight: 600 }}>
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Current Status</div>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="form-select"
                    style={{ height: '32px', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>
                  Ordered Items ({selectedOrder.items?.length || 0})
                </h4>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderBottom: idx === selectedOrder.items.length - 1 ? 'none' : '1px solid var(--color-border)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={item.image || '/images/onboarding_plant.jpg'}
                          alt={item.name}
                          style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                            Qty: {item.quantity} × {formatINR(item.price)}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        {formatINR((item.price || 0) * (item.quantity || 1))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Payment */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
                    <MapPin size={16} />
                    <span>Shipping Address</span>
                  </div>
                  {selectedOrder.shippingAddress ? (
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--color-primary-text)' }}>
                      <strong>{selectedOrder.shippingAddress.fullName}</strong>
                      <br />
                      {selectedOrder.shippingAddress.house && `${selectedOrder.shippingAddress.house}, `}
                      {selectedOrder.shippingAddress.street}
                      <br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                      <br />
                      Phone: {selectedOrder.shippingAddress.phone}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                      Standard delivery address
                    </div>
                  )}
                </div>

                <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
                    <CreditCard size={16} />
                    <span>Financial Summary</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-secondary-text)' }}>Payment Method:</span>
                      <strong>{selectedOrder.paymentMethod || 'UPI'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-secondary-text)' }}>Subtotal:</span>
                      <span>{formatINR(selectedOrder.pricing?.subtotal || selectedOrder.subtotal || 0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-secondary-text)' }}>Delivery Fee:</span>
                      <span>{formatINR(selectedOrder.pricing?.deliveryFee || selectedOrder.delivery_fee || 0)}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid var(--color-border)',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}
                    >
                      <span>Final Total:</span>
                      <span style={{ color: 'var(--color-primary-green)' }}>
                        {formatINR(selectedOrder.pricing?.total || selectedOrder.total_amount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="btn btn-secondary btn-sm"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
