// src/components/common/EmptyState.jsx
import { Link } from 'react-router-dom';
import emptyCartImg from '../../assets/illustrations/empty-cart.svg';
import emptyWishlistImg from '../../assets/illustrations/empty-wishlist.svg';
import emptyOrdersImg from '../../assets/illustrations/empty-orders.svg';

export function EmptyState({
  type = 'cart',
  title,
  message,
  actionText = 'Explore Plants',
  actionLink = '/shop',
  onActionClick
}) {
  const images = {
    cart: emptyCartImg,
    wishlist: emptyWishlistImg,
    orders: emptyOrdersImg,
    search: emptyCartImg
  };

  const illustration = images[type] || emptyCartImg;

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        maxWidth: '460px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          width: '180px',
          height: '150px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src={illustration}
          alt={title || 'Empty state'}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      <h3
        style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--color-dark-green)',
          marginBottom: '0.65rem'
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: 'var(--color-secondary-text)',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          marginBottom: '1.75rem'
        }}
      >
        {message}
      </p>

      {onActionClick ? (
        <button type="button" onClick={onActionClick} className="btn btn-primary">
          {actionText}
        </button>
      ) : (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
}
