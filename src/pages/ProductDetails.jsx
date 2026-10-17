// src/pages/ProductDetails.jsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Sun,
  Droplets,
  Sprout,
  ShieldAlert,
  ShieldCheck,
  Check,
  Star,
  ChevronRight,
  Share2
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { formatINR } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/product/ProductCard';

export function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Plant Not Found</h2>
        <p style={{ marginTop: '0.75rem', marginBottom: '2rem' }}>
          We could not find the plant or botanical supply you were looking for.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = PRODUCTS.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 4);

  const handleQtyChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, false);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Plant link copied to clipboard!', 'info');
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--color-secondary-text)',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}
      >
        <Link to="/" style={{ color: 'var(--color-secondary-text)' }}>
          Home
        </Link>
        <ChevronRight size={14} />
        <Link to="/shop" style={{ color: 'var(--color-secondary-text)' }}>
          Shop
        </Link>
        <ChevronRight size={14} />
        <Link to={`/shop?category=${product.categoryId}`} style={{ color: 'var(--color-secondary-text)' }}>
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-dark-green)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      <div className="product-details-grid">
        <div className="product-details-media" style={{ position: 'sticky', top: '100px' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--color-sage-subtle)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '1.25rem',
                left: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              {discountPercent > 0 && (
                <span className="badge badge-discount">{discountPercent}% OFF</span>
              )}
              {product.isBestseller && (
                <span className="badge badge-sage">Bestseller</span>
              )}
              <span className="badge badge-stock">
                <Check size={12} />
                <span>In Stock</span>
              </span>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                display: 'flex',
                gap: '0.5rem'
              }}
            >
              <button
                type="button"
                onClick={handleShare}
                className="nav-action-btn"
                aria-label="Share plant"
                style={{ width: '38px', height: '38px' }}
              >
                <Share2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`product-wishlist-btn ${inWishlist ? 'active' : ''}`}
                style={{ position: 'static' }}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-accent-green)',
              marginBottom: '0.4rem'
            }}
          >
            {product.category} • {product.plantType}
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', marginBottom: '0.85rem' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#FEF7E6',
                color: '#B57905',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '0.875rem'
              }}
            >
              <Star size={16} fill="#E29B12" color="#E29B12" />
              <span>{product.rating}</span>
            </div>
            <span style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
              Based on {product.reviewsCount} customer plant reviews
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem',
              padding: '1.25rem 1.5rem',
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              marginBottom: '1.75rem'
            }}
          >
            <span
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-dark-green)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {formatINR(product.price)}
            </span>
            {product.originalPrice && (
              <span
                style={{
                  fontSize: '1.15rem',
                  textDecoration: 'line-through',
                  color: 'var(--color-secondary-text)'
                }}
              >
                {formatINR(product.originalPrice)}
              </span>
            )}
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.85rem',
                color: 'var(--color-success)',
                fontWeight: 600
              }}
            >
              Inclusive of all taxes
            </span>
          </div>

          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.65,
              color: 'var(--color-primary-text)',
              opacity: 0.9,
              marginBottom: '2rem'
            }}
          >
            {product.description}
          </p>

          <div
            className="product-details-specs"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}
          >
            <div
              style={{
                background: 'var(--color-white)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-green)', marginBottom: '0.25rem' }}>
                <Sun size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Light</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{product.lightRequirement}</div>
            </div>

            <div
              style={{
                background: 'var(--color-white)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-green)', marginBottom: '0.25rem' }}>
                <Droplets size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Watering</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{product.watering}</div>
            </div>

            <div
              style={{
                background: 'var(--color-white)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-green)', marginBottom: '0.25rem' }}>
                <Sprout size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Plant Size</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{product.size} (Includes Pot)</div>
            </div>

            <div
              style={{
                background: 'var(--color-white)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-green)', marginBottom: '0.25rem' }}>
                {product.careGuide.petFriendly ? (
                  <ShieldCheck size={18} color="var(--color-success)" />
                ) : (
                  <ShieldAlert size={18} color="var(--color-warning)" />
                )}
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Pet Safe</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                {product.careGuide.petFriendly ? '100% Pet Friendly' : 'Keep Away From Pets'}
              </div>
            </div>
          </div>

          <div
            className="product-details-actions"
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '2.5rem'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-white)',
                padding: '0.25rem'
              }}
            >
              <button
                type="button"
                onClick={() => handleQtyChange(-1)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  color: 'var(--color-dark-green)'
                }}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span
                style={{
                  width: '42px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQtyChange(1)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  color: 'var(--color-dark-green)'
                }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="btn btn-secondary btn-lg"
              style={{ flex: '1 1 180px' }}
            >
              <ShoppingBag size={18} />
              <span>Add to Basket</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="btn btn-primary btn-lg"
              style={{ flex: '1 1 180px' }}
            >
              <span>Buy Now</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div
            style={{
              background: 'var(--color-soft-sage)',
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #D5E4D2'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--color-dark-green)' }}>
              Botanical Care Instructions
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <li>
                <strong>Light & Placement:</strong> {product.careGuide.light}
              </li>
              <li>
                <strong>Watering Schedule:</strong> {product.careGuide.watering}
              </li>
              <li>
                <strong>Potting & Soil Mix:</strong> {product.careGuide.soil}
              </li>
              <li>
                <strong>Repotting:</strong> {product.careGuide.repotting}
              </li>
              <li style={{ color: 'var(--color-primary-green)', fontWeight: 600 }}>
                💡 <strong>Expert Tip:</strong> {product.careGuide.tip}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
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
                Companion Plants
              </div>
              <h2>You May Also Like</h2>
            </div>
            <Link to={`/shop?category=${product.categoryId}`} className="btn btn-outline btn-sm">
              <span>View More in {product.category}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
