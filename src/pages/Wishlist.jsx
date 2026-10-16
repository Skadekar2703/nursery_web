// src/pages/Wishlist.jsx
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatINR } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';

export function Wishlist() {
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <EmptyState
          type="wishlist"
          title="Your Wishlist is Empty"
          message="You haven't saved any plants yet. Tap the heart icon on any botanical beauty to save it here for later."
          actionText="Explore Plants"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
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
            Saved Botanical Beauties
          </div>
          <h1>My Wishlist ({wishlistItems.length})</h1>
        </div>
        <Link to="/shop" className="btn btn-outline btn-sm">
          <span>Continue Shopping</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid-4">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="product-card"
            style={{ position: 'relative' }}
          >
            <div className="product-card-image-wrapper">
              <Link to={`/product/${product.slug}`} style={{ width: '100%', height: '100%' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card-image"
                />
              </Link>
              <button
                type="button"
                onClick={() => removeFromWishlist(product.id)}
                className="product-wishlist-btn active"
                title="Remove from wishlist"
                aria-label={`Remove ${product.name} from wishlist`}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="product-card-body">
              <div className="product-category-meta">{product.category}</div>
              <h3 className="product-title">
                <Link to={`/product/${product.slug}`}>{product.name}</Link>
              </h3>

              <div className="product-price-row">
                <span className="product-current-price">{formatINR(product.price)}</span>
                {product.originalPrice && (
                  <span className="product-original-price">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => moveToCart(product.id)}
                className="btn btn-primary btn-sm btn-block"
              >
                <ShoppingBag size={15} />
                <span>Move to Basket</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
