// src/pages/Checkout.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  Plus,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Smartphone,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { formatINR, isValidIndianPhone, isValidPincode } from '../utils/formatters';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'West Bengal'
];

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, deliveryFee, discountAmount, finalTotal } = useCart();
  const { addresses, selectedAddress, selectedAddressId, selectAddress, addAddress } = useAddress();
  const { placeOrder } = useOrders();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState('address');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(addresses.length === 0);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    house: '',
    street: '',
    landmark: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    isDefault: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('UPI — Demo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Your Basket is Empty</h2>
        <p style={{ margin: '0.75rem 0 2rem' }}>Add some lush botanical companions before checking out.</p>
        <Link to="/shop" className="btn btn-primary">
          Explore Plants
        </Link>
      </div>
    );
  }

  const validateAddressForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!formData.phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (!isValidIndianPhone(formData.phone)) {
      errors.phone = 'Enter a valid 10-digit Indian mobile number';
    }
    if (!formData.house.trim()) errors.house = 'Flat/House number is required';
    if (!formData.street.trim()) errors.street = 'Street or locality is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.pincode.trim()) {
      errors.pincode = 'PIN code is required';
    } else if (!isValidPincode(formData.pincode)) {
      errors.pincode = 'Enter a valid 6-digit Indian PIN code';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (validateAddressForm()) {
      addAddress(formData);
      setIsAddingNewAddress(false);
      setFormData({
        fullName: '',
        phone: '',
        house: '',
        street: '',
        landmark: '',
        city: '',
        state: 'Karnataka',
        pincode: '',
        isDefault: false
      });
      setFormErrors({});
    } else {
      addToast('Please correct the address form errors', 'error');
    }
  };

  const handleProceedToSummary = () => {
    if (!selectedAddress && !isAddingNewAddress) {
      addToast('Please select or add a delivery address', 'error');
      return;
    }
    if (isAddingNewAddress) {
      if (validateAddressForm()) {
        addAddress(formData);
        setIsAddingNewAddress(false);
        setCurrentStep('summary');
      } else {
        addToast('Please complete the address form properly', 'error');
        return;
      }
    } else {
      setCurrentStep('summary');
    }
  };

  const handlePlaceFinalOrder = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const order = placeOrder({
        cartItems,
        subtotal,
        deliveryFee,
        discountAmount,
        finalTotal,
        address: selectedAddress,
        paymentMethod
      });

      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error('Order error:', err);
      addToast('Could not complete order. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="checkout-steps">
        <Link to="/cart" className="step-item completed">
          <span className="step-number">✓</span>
          <span>Shopping Basket</span>
        </Link>
        <div className="step-divider" />
        <div className={`step-item ${currentStep === 'address' ? 'active' : 'completed'}`}>
          <span className="step-number">{currentStep === 'address' ? '2' : '✓'}</span>
          <span>Delivery Address</span>
        </div>
        <div className="step-divider" />
        <div className={`step-item ${currentStep === 'summary' ? 'active' : currentStep === 'payment' ? 'completed' : ''}`}>
          <span className="step-number">{currentStep === 'payment' ? '✓' : '3'}</span>
          <span>Order Review</span>
        </div>
        <div className="step-divider" />
        <div className={`step-item ${currentStep === 'payment' ? 'active' : ''}`}>
          <span className="step-number">4</span>
          <span>Simulated Payment</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start'
        }}
      >
        <div>
          {currentStep === 'address' && (
            <div
              style={{
                background: 'var(--color-white)',
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <MapPin size={24} color="var(--color-primary-green)" />
                <h2 style={{ fontSize: '1.5rem' }}>Shipping & Delivery Address</h2>
              </div>

              {addresses.length > 0 && !isAddingNewAddress && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          padding: '1.25rem',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${selectedAddressId === addr.id ? 'var(--color-primary-green)' : 'var(--color-border)'}`,
                          background: selectedAddressId === addr.id ? 'var(--color-soft-sage)' : 'var(--color-white)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => selectAddress(addr.id)}
                          style={{ marginTop: '4px', accentColor: 'var(--color-primary-green)' }}
                        />
                        <div style={{ flex: 1, fontSize: '0.95rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <strong style={{ color: 'var(--color-dark-green)', fontSize: '1rem' }}>
                              {addr.fullName}
                            </strong>
                            {addr.isDefault && (
                              <span className="badge badge-sage" style={{ fontSize: '0.7rem' }}>
                                Default
                              </span>
                            )}
                          </div>
                          <div style={{ color: 'var(--color-primary-text)' }}>
                            {addr.house}, {addr.street}
                          </div>
                          {addr.landmark && (
                            <div style={{ color: 'var(--color-secondary-text)', fontSize: '0.85rem' }}>
                              Landmark: {addr.landmark}
                            </div>
                          )}
                          <div style={{ color: 'var(--color-primary-text)' }}>
                            {addr.city}, {addr.state} — <strong>{addr.pincode}</strong>
                          </div>
                          <div style={{ color: 'var(--color-secondary-text)', marginTop: '0.35rem', fontSize: '0.875rem' }}>
                            Phone: +91 {addr.phone}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1.25rem' }}
                  >
                    <Plus size={16} />
                    <span>Add New Delivery Address</span>
                  </button>
                </div>
              )}

              {isAddingNewAddress && (
                <form onSubmit={handleSaveNewAddress} style={{ marginTop: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--color-dark-green)' }}>
                    Add a New Delivery Address
                  </h3>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        Full Recipient Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Priya Nair"
                        className={`form-input ${formErrors.fullName ? 'is-error' : ''}`}
                      />
                      {formErrors.fullName && <span className="form-error-msg">{formErrors.fullName}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Mobile Number <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength="10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="10-digit mobile number"
                        className={`form-input ${formErrors.phone ? 'is-error' : ''}`}
                      />
                      {formErrors.phone && <span className="form-error-msg">{formErrors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Flat / House No. / Building <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.house}
                      onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                      placeholder="e.g. Villa 12, Palm Residency"
                      className={`form-input ${formErrors.house ? 'is-error' : ''}`}
                    />
                    {formErrors.house && <span className="form-error-msg">{formErrors.house}</span>}
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        Street / Area / Colony <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        placeholder="e.g. 5th Main, Koramangala"
                        className={`form-input ${formErrors.street ? 'is-error' : ''}`}
                      />
                      {formErrors.street && <span className="form-error-msg">{formErrors.street}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Landmark (Optional)</label>
                      <input
                        type="text"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        placeholder="e.g. Near Rosewood School"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">
                        City <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Bengaluru"
                        className={`form-input ${formErrors.city ? 'is-error' : ''}`}
                      />
                      {formErrors.city && <span className="form-error-msg">{formErrors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        State <span className="required">*</span>
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="form-select"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        6-Digit PIN Code <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength="6"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                        placeholder="e.g. 560034"
                        className={`form-input ${formErrors.pincode ? 'is-error' : ''}`}
                      />
                      {formErrors.pincode && <span className="form-error-msg">{formErrors.pincode}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Address
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {!isAddingNewAddress && (
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={handleProceedToSummary} className="btn btn-primary btn-lg">
                    <span>Continue to Order Review</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'summary' && (
            <div
              style={{
                background: 'var(--color-white)',
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Review Your Order</h2>
                <button
                  type="button"
                  onClick={() => setCurrentStep('address')}
                  style={{ color: 'var(--color-primary-green)', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Change Address
                </button>
              </div>

              {selectedAddress && (
                <div
                  style={{
                    background: 'var(--color-soft-sage)',
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #D2E3CF',
                    marginBottom: '2rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--color-primary-green)' }}>
                    <MapPin size={18} />
                    <strong>Delivering to:</strong>
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--color-dark-green)', fontWeight: 700 }}>
                    {selectedAddress.fullName} (+91 {selectedAddress.phone})
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-primary-text)' }}>
                    {selectedAddress.house}, {selectedAddress.street}
                    {selectedAddress.landmark && `, near ${selectedAddress.landmark}`}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-primary-text)' }}>
                    {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Items in Basket ({cartItems.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      background: 'var(--color-warm-cream)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.product.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                          Qty: {item.quantity} × {formatINR(item.product.price)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--color-dark-green)' }}>
                      {formatINR(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep('address')}
                  className="btn btn-secondary"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Address</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep('payment')}
                  className="btn btn-primary btn-lg"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'payment' && (
            <div
              style={{
                background: 'var(--color-white)',
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Lock size={22} color="var(--color-primary-green)" />
                <h2 style={{ fontSize: '1.5rem' }}>Select Demo Payment Method</h2>
              </div>

              <div className="demo-banner">
                <ShieldCheck size={20} color="var(--color-primary-green)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Demo Mode Active:</strong> All payment selections are simulated locally. No real money or payment accounts will ever be charged.
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === 'UPI — Demo' ? 'var(--color-primary-green)' : 'var(--color-border)'}`,
                    background: paymentMethod === 'UPI — Demo' ? 'var(--color-soft-sage)' : 'var(--color-white)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentMethod === 'UPI — Demo'}
                    onChange={() => setPaymentMethod('UPI — Demo')}
                    style={{ accentColor: 'var(--color-primary-green)' }}
                  />
                  <Smartphone size={22} color="var(--color-primary-green)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-dark-green)' }}>
                      UPI (Google Pay / PhonePe / Paytm / BHIM)
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                      Instant simulated demo payment without entering PIN
                    </div>
                  </div>
                  <span className="badge badge-sage">Fastest</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === 'Card — Demo' ? 'var(--color-primary-green)' : 'var(--color-border)'}`,
                    background: paymentMethod === 'Card — Demo' ? 'var(--color-soft-sage)' : 'var(--color-white)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentMethod === 'Card — Demo'}
                    onChange={() => setPaymentMethod('Card — Demo')}
                    style={{ accentColor: 'var(--color-primary-green)' }}
                  />
                  <CreditCard size={22} color="var(--color-primary-green)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-dark-green)' }}>
                      Credit or Debit Card — Demo
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                      Simulated Visa, Mastercard, or RuPay card payment
                    </div>
                  </div>
                  <span className="badge badge-category">Simulated</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentMethod === 'Cash on Delivery' ? 'var(--color-primary-green)' : 'var(--color-border)'}`,
                    background: paymentMethod === 'Cash on Delivery' ? 'var(--color-soft-sage)' : 'var(--color-white)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    style={{ accentColor: 'var(--color-primary-green)' }}
                  />
                  <DollarSign size={22} color="var(--color-primary-green)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-dark-green)' }}>
                      Cash on Delivery
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                      Pay cash when mock order arrives at your doorstep
                    </div>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep('summary')}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Review</span>
                </button>
                <button
                  type="button"
                  onClick={handlePlaceFinalOrder}
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  <CheckCircle2 size={18} />
                  <span>{isSubmitting ? 'Processing Order...' : `Place Order (${formatINR(finalTotal)})`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'sticky', top: '100px' }}>
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
              Summary & Total
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', maxHeight: '180px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-primary-text)' }}>
                    {item.product.name} <strong style={{ color: 'var(--color-secondary-text)' }}>×{item.quantity}</strong>
                  </span>
                  <span style={{ fontWeight: 600 }}>{formatINR(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary-text)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary-text)' }}>{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: 600 }}>- {formatINR(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary-text)' }}>
                <span>Standard Delivery</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : formatINR(deliveryFee)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--color-dark-green)',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '0.75rem'
                }}
              >
                <span>Total Amount</span>
                <span>{formatINR(finalTotal)}</span>
              </div>
            </div>

            <div style={{ background: 'var(--color-soft-sage)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--color-dark-green)' }}>
              🔒 <strong>Safe Simulated Checkout:</strong> No banking credentials or OTP required.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
