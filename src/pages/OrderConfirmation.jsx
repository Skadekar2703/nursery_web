// src/pages/OrderConfirmation.jsx
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { formatINR, formatDate } from '../utils/formatters';
import orderSuccessImg from '../assets/illustrations/order-success.svg';

export function OrderConfirmation() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ margin: '0.75rem 0 2rem' }}>We could not locate this order in your local records.</p>
        <Link to="/orders" className="btn btn-primary">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '780px' }}>
      <div
        style={{
          textAlign: 'center',
          background: 'var(--color-white)',
          padding: '3rem 2rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ width: '130px', height: '110px', margin: '0 auto 1.25rem' }}>
          <img
            src={orderSuccessImg}
            alt="Order confirmed"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <span
          className="badge badge-stock"
          style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', marginBottom: '0.75rem' }}
        >
          Order Confirmed
        </span>

        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
          Thank You for Growing With Us!
        </h1>
        <p style={{ color: 'var(--color-secondary-text)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
          Your simulated plant order has been safely placed. We are preparing your botanical companions for delivery.
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'var(--color-soft-sage)',
            color: 'var(--color-primary-green)',
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <ShieldCheck size={18} />
          <span>Demo payment successful. No real payment was processed.</span>
        </div>
      </div>

      <div
        className="confirmation-card"
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem'
        }}
      >
        <div className="confirmation-meta-grid">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
              Order Reference
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-green)', marginTop: '0.2rem' }}>
              {order.id}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
              Order Placed
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem' }}>
              {formatDate(order.createdAt)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
              Payment Method
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.2rem' }}>
              {order.paymentMethod}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Billed
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-green)', marginTop: '0.2rem' }}>
              {formatINR(order.pricing.total)}
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Purchased Plant Specimens</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
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
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                    Qty: {item.quantity} × {formatINR(item.price)}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--color-dark-green)' }}>
                {formatINR(item.total)}
              </div>
            </div>
          ))}
        </div>

        {order.shippingAddress && (
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-soft-sage)',
              border: '1px solid #D2E3CF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: 'var(--color-primary-green)' }}>
              <MapPin size={18} />
              <strong style={{ fontSize: '0.95rem' }}>Shipping Address Snapshot</strong>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-dark-green)', fontWeight: 700 }}>
              {order.shippingAddress.fullName} (+91 {order.shippingAddress.phone})
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-text)' }}>
              {order.shippingAddress.house}, {order.shippingAddress.street}
              {order.shippingAddress.landmark && `, near ${order.shippingAddress.landmark}`}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-text)' }}>
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/orders" className="btn btn-secondary btn-lg">
          <Package size={18} />
          <span>View All Orders</span>
        </Link>
        <Link to="/shop" className="btn btn-primary btn-lg">
          <span>Continue Shopping</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
