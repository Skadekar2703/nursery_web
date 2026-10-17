// src/pages/OrderDetails.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Clock,
  Truck
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { formatINR, formatDate } from '../utils/formatters';
import { ConfirmModal } from '../components/common/ConfirmModal';

export function OrderDetails() {
  const { orderId } = useParams();
  const { getOrderById, cancelOrder } = useOrders();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ margin: '0.75rem 0 2rem' }}>We could not locate this order.</p>
        <Link to="/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  const handleCancelOrder = () => {
    cancelOrder(order.id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-stock">Delivered</span>;
      case 'Processing':
        return <span className="badge badge-rating">Processing</span>;
      case 'Cancelled':
        return <span className="badge badge-discount">Cancelled</span>;
      case 'Confirmed':
      default:
        return <span className="badge badge-sage">Confirmed</span>;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '860px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-primary-green)',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to All Orders</span>
        </Link>
      </div>

      <div
        className="order-details-card"
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--color-dark-green)' }}>Order {order.id}</h1>
              {getStatusBadge(order.status)}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', marginTop: '0.25rem' }}>
              Placed on {formatDate(order.createdAt)}
            </div>
          </div>

          {order.status === 'Confirmed' && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
            >
              Cancel Order (Demo)
            </button>
          )}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-secondary-text)' }}>
            Order Status Tracking (Simulated)
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              overflowX: 'auto',
              padding: '0.75rem 0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.85rem' }}>
              <CheckCircle2 size={18} />
              <span>Order Confirmed</span>
            </div>
            <div style={{ width: '24px', height: '2px', background: order.status === 'Cancelled' ? 'var(--color-error)' : 'var(--color-success)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: order.status === 'Processing' || order.status === 'Delivered' ? 'var(--color-success)' : 'var(--color-secondary-text)', fontWeight: 600, fontSize: '0.85rem' }}>
              <Clock size={18} />
              <span>Plant Packing</span>
            </div>
            <div style={{ width: '24px', height: '2px', background: order.status === 'Delivered' ? 'var(--color-success)' : 'var(--color-border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: order.status === 'Delivered' ? 'var(--color-success)' : 'var(--color-secondary-text)', fontWeight: 600, fontSize: '0.85rem' }}>
              <Truck size={18} />
              <span>Delivered</span>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Items in this Order</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="order-item-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-warm-cream)',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ fontSize: '1rem' }}>
                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                    {item.category} • Qty: {item.quantity} × {formatINR(item.price)}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                {formatINR(item.total)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-details-summary-grid">
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-dark-green)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={17} color="var(--color-primary-green)" />
              <span>Shipping Address Snapshot</span>
            </h4>
            <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-primary-text)' }}>
              <strong>{order.shippingAddress?.fullName}</strong>
              <div>+91 {order.shippingAddress?.phone}</div>
              <div>{order.shippingAddress?.house}, {order.shippingAddress?.street}</div>
              {order.shippingAddress?.landmark && <div>Landmark: {order.shippingAddress?.landmark}</div>}
              <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</div>
            </div>

            <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </div>
          </div>

          <div
            style={{
              background: 'var(--color-soft-sage)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #D2E3CF'
            }}
          >
            <h4 style={{ fontSize: '1rem', color: 'var(--color-dark-green)', marginBottom: '0.85rem' }}>
              Payment Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary-text)' }}>
                <span>Subtotal</span>
                <span>{formatINR(order.pricing.subtotal)}</span>
              </div>
              {order.pricing.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Discount</span>
                  <span>- {formatINR(order.pricing.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary-text)' }}>
                <span>Delivery</span>
                <span>{order.pricing.deliveryFee === 0 ? 'FREE' : formatINR(order.pricing.deliveryFee)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #C4D6C1',
                  paddingTop: '0.65rem',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--color-dark-green)'
                }}
              >
                <span>Total Paid</span>
                <span>{formatINR(order.pricing.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancelModal}
        title="Cancel this simulated order?"
        message="Are you sure you want to cancel this order?"
        confirmText="Confirm Cancellation"
        confirmVariant="danger"
        onConfirm={handleCancelOrder}
        onClose={() => setShowCancelModal(false)}
      />
    </div>
  );
}
