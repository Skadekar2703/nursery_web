// src/pages/Orders.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { formatINR, formatDate } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';

export function Orders() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <EmptyState
          type="orders"
          title="No Orders Placed Yet"
          message="You have not placed any simulated plant orders yet. Browse our lush catalog to bring nature into your home."
          actionText="Explore Plants"
          actionLink="/shop"
        />
      </div>
    );
  }

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
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '1rem'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-accent-green)',
              marginBottom: '0.35rem'
            }}
          >
            Order Tracking & History
          </div>
          <h1>My Orders ({orders.length})</h1>
        </div>
        <Link to="/shop" className="btn btn-outline btn-sm">
          <span>Shop More Plants</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => {
          const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <article
              key={order.id}
              className="order-card"
              style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--color-border)',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                      {order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginTop: '0.2rem' }}>
                    Placed on {formatDate(order.createdAt)}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                    {formatINR(order.pricing.total)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                    {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  overflowX: 'auto',
                  paddingBottom: '0.5rem',
                  marginBottom: '1.25rem'
                }}
              >
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'var(--color-warm-cream)',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-text)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                        Qty: {item.quantity} • {formatINR(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ color: 'var(--color-secondary-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} />
                  <span>
                    Delivering to {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
                  </span>
                </div>
                <Link to={`/orders/${order.id}`} className="btn btn-secondary btn-sm">
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
