import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Plus, Minus } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleDecreaseQty = (e) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = (e) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product.id, quantity);
  };

  return (
    <article className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="product-card-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />

        <div className="product-card-badges">
          {discountPercent > 0 && (
            <span className="badge badge-discount">{discountPercent}% OFF</span>
          )}
          {product.isBestseller && (
            <span className="badge badge-sage">Bestseller</span>
          )}
          {product.isNewArrival && (
            <span className="badge badge-rating">New</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlistClick}
          className={`product-wishlist-btn ${inWishlist ? 'active' : ''}`}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-category-meta">{product.category}</div>
        <h3 className="product-title">
          <Link to={`/product/${product.slug}`} onClick={(e) => e.stopPropagation()}>
            {product.name}
          </Link>
        </h3>

        <div className="product-rating-row">
          <div className="product-stars">
            <Star size={14} fill="#E29B12" color="#E29B12" />
            <span style={{ fontWeight: 700, color: '#3A2E16' }}>{product.rating}</span>
          </div>
          <span className="product-reviews-count">({product.reviewsCount})</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
            {product.size}
          </span>
        </div>

        <div className="product-price-row">
          <span className="product-current-price">{formatINR(product.price)}</span>
          {product.originalPrice && (
            <span className="product-original-price">{formatINR(product.originalPrice)}</span>
          )}
        </div>

        <div className="product-card-footer" onClick={(e) => e.stopPropagation()}>
          <div className="product-card-action-row">
            <div
              className="product-card-qty-control"
              role="group"
              aria-label={`Select quantity for ${product.name}`}
            >
              <button
                type="button"
                onClick={handleDecreaseQty}
                className="product-card-qty-btn"
                aria-label={`Decrease quantity of ${product.name}`}
                disabled={quantity <= 1}
              >
                <Minus size={13} strokeWidth={2.5} />
              </button>
              <span className="product-card-qty-value" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncreaseQty}
                className="product-card-qty-btn"
                aria-label={`Increase quantity of ${product.name}`}
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="btn btn-secondary btn-sm product-card-add-btn"
              aria-label={`Add ${quantity} ${product.name} to basket`}
            >
              <ShoppingBag size={14} />
              <span>Add to Basket</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
