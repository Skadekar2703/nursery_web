// src/pages/Cart.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Minus,
  Plus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';

export function Cart() {
  const {
    cartItems,
    cartCount,
    subtotal,
    deliveryFee,
    discountAmount,
    finalTotal,
    appliedCoupon,
    freeDeliveryThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-container">
        <EmptyState
          type="cart"
          title="Your Shopping Basket is Empty"
          message="Your botanical home is waiting for its first green companion. Discover air-purifying foliage, flowering blossoms, and handcrafted ceramic pots."
          actionText="Browse Plants"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      {/* Checkout Steps Progress Bar */}
      <div className="checkout-steps" style={{ marginBottom: '2.5rem' }}>
        <div className="step-item active">
          <span className="step-number">1</span>
          <span>Shopping Basket</span>
        </div>
        <div className="step-divider" />
        <div className="step-item">
          <span className="step-number">2</span>
          <span>Delivery Address</span>
        </div>
        <div className="step-divider" />
        <div className="step-item">
          <span className="step-number">3</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Header */}
      <div className="cart-header-row">
        <div>
          <h1 className="cart-header-title">Your Basket ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>
          <p className="cart-header-subtitle">
            Review your selected botanical items before proceeding to checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowClearConfirm(true)}
          className="cart-clear-btn"
          aria-label="Empty shopping basket"
        >
          <RotateCcw size={15} />
          <span>Clear Basket</span>
        </button>
      </div>

      {/* Free Delivery Incentive Bar */}
      <div className="cart-delivery-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
          <Truck size={20} color="var(--color-primary-green)" />
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>
            {remainingForFreeDelivery === 0 ? (
              <span style={{ color: 'var(--color-success)' }}>
                🎉 Congratulations! You have unlocked Free Standard Delivery!
              </span>
            ) : (
              <span>
                Add <strong style={{ color: 'var(--color-primary-green)' }}>{formatINR(remainingForFreeDelivery)}</strong> more to qualify for <strong>FREE Delivery</strong>!
              </span>
            )}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'var(--color-soft-sage)',
            borderRadius: 'var(--radius-pill)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${deliveryProgress}%`,
              height: '100%',
              background: 'var(--color-primary-green)',
              borderRadius: 'var(--radius-pill)',
              transition: 'width 300ms ease'
            }}
          />
        </div>
      </div>

      {/* Two-Column Grid Layout */}
      <div className="cart-layout-grid">
        {/* Left Column: Items List & Continue Shopping */}
        <div className="cart-items-column">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item-card">
                {/* Thumbnail */}
                <Link
                  to={`/product/${item.product.slug}`}
                  className="cart-item-thumb"
                  aria-label={`View details for ${item.product.name}`}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-item-img"
                  />
                </Link>

                {/* Details */}
                <div className="cart-item-details">
                  <span className="cart-item-category">
                    {item.product.category}
                  </span>
                  <h3 className="cart-item-title">
                    <Link to={`/product/${item.product.slug}`}>
                      {item.product.name}
                    </Link>
                  </h3>
                  <div className="cart-item-unit-price">
                    Unit price: {formatINR(item.product.price)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="cart-item-qty">
                  <div
                    className="cart-item-qty-control"
                    role="group"
                    aria-label={`Adjust quantity for ${item.product.name}`}
                  >
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="cart-item-qty-btn"
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.product.name}`}
                    >
                      <Minus size={13} strokeWidth={2.5} />
                    </button>
                    <span className="cart-item-qty-val" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="cart-item-qty-btn"
                      aria-label={`Increase quantity of ${item.product.name}`}
                    >
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Row Total */}
                <div className="cart-item-total">
                  {formatINR(item.totalPrice)}
                </div>

                {/* Delete Button */}
                <div className="cart-item-remove">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="cart-item-remove-btn"
                    title="Remove item"
                    aria-label={`Remove ${item.product.name} from basket`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-continue-shopping-row">
            <Link
              to="/shop"
              className="btn btn-outline btn-md"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Price Breakdown Card */}
        <div className="cart-summary-column">
          <div className="cart-summary-card">
            <h3 className="cart-summary-title">Order Price Breakdown</h3>

            {/* Promo Code Input */}
            <div className="cart-coupon-box">
              {appliedCoupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#EDF8EE',
                    border: '1px solid #C4E6C7',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.875rem' }}>
                    <Tag size={16} />
                    <span>Coupon "{appliedCoupon.code}" ({appliedCoupon.percent}% OFF)</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    style={{
                      color: 'var(--color-error)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (NURSURY10)"
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '0.65rem 0.85rem' }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Breakdown Table */}
            <div className="cart-price-table">
              <div className="cart-price-row">
                <span>Basket Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary-text)' }}>
                  {formatINR(subtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="cart-price-row" style={{ color: 'var(--color-success)' }}>
                  <span>Promotional Discount</span>
                  <span style={{ fontWeight: 600 }}>- {formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="cart-price-row">
                <span>Estimated Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>FREE</span>
                  ) : (
                    formatINR(deliveryFee)
                  )}
                </span>
              </div>

              <div className="cart-price-row total-row">
                <span>Final Total</span>
                <span>{formatINR(finalTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="cart-summary-actions">
              <Link
                to="/checkout"
                className="btn btn-primary btn-lg btn-block"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.9rem 1.5rem',
                  fontSize: '1rem'
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Trust and Guarantee Badges */}
            <div className="cart-guarantee-badges">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={15} color="var(--color-primary-green)" />
                <span>Free delivery on orders above ₹799</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={15} color="var(--color-primary-green)" />
                <span>100% Transit-safe botanical packaging guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--color-primary-green)" />
                <span>Simulated secure demo payment & checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Basket Confirmation Dialog */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Empty your shopping basket?"
        message="Are you sure you want to remove all plants and garden supplies from your current shopping basket?"
        confirmText="Yes, Empty Basket"
        confirmVariant="danger"
        onConfirm={clearCart}
        onClose={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
