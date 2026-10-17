// src/pages/Profile.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Package,
  Heart,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';

export function Profile() {
  const { user, profile, isAdmin, signOut, updateProfile } = useAuth();
  const { addresses, deleteAddress, setDefaultAddress } = useAddress();
  const { orders } = useOrders();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: ''
  });

  const handleToggleEdit = () => {
    if (!isEditing) {
      setFormData({
        displayName: profile?.full_name || profile?.displayName || '',
        bio: profile?.bio || ''
      });
    }
    setIsEditing((prev) => !prev);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const displayName = profile?.full_name || profile?.displayName || user?.email?.split('@')[0] || 'Plant Parent';
  const displayEmail = profile?.email || user?.email || 'guest@nursury.store';
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'October 2026';

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '880px' }}>
      {/* Top Banner for Admins */}
      {isAdmin && (
        <div
          style={{
            backgroundColor: 'var(--color-dark-green)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <ShieldCheck size={24} color="var(--color-accent-green)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Administrator Clearance Active</div>
              <div style={{ fontSize: '0.85rem', color: '#CBD5C8' }}>
                You have verified staff administration rights for Nursury botanical store.
              </div>
            </div>
          </div>
          <Link to="/admin" className="btn btn-sm" style={{ backgroundColor: 'var(--color-accent-green)', color: '#FFF' }}>
            <span>Open Admin Console</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
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
            Customer Account & Profile
          </div>
          <h1>My Botanical Sanctuary</h1>
          <p style={{ marginTop: '0.35rem' }}>
            Manage your personal profile, review order history, and maintain delivery addresses.
          </p>
        </div>

        {user ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-error)' }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-secondary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div
        className="profile-card"
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-soft-sage)',
                color: 'var(--color-primary-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--color-dark-green)' }}>
                  {displayName}
                </h2>
                <span className={`admin-badge ${isAdmin ? 'info' : 'success'}`} style={{ fontSize: '0.7rem' }}>
                  {isAdmin ? 'Staff Admin' : 'Verified Customer'}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)' }}>
                {displayEmail} • Member since {joinedDate}
              </div>
            </div>
          </div>

          {user && (
            <button
              type="button"
              onClick={handleToggleEdit}
              className="btn btn-secondary btn-sm"
            >
              <Edit2 size={15} />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          )}
        </div>

        {!isEditing ? (
          <p
            style={{
              color: 'var(--color-primary-text)',
              opacity: 0.85,
              fontSize: '0.95rem',
              fontStyle: 'italic',
              borderTop: '1px solid var(--color-border)',
              paddingTop: '1rem'
            }}
          >
            "{profile?.bio || 'Botanical enthusiast & indoor jungle curator.'}"
          </p>
        ) : (
          <form onSubmit={handleSaveProfile} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Managed by Supabase Auth)</label>
                <input
                  type="email"
                  value={displayEmail}
                  disabled
                  className="form-input"
                  style={{ backgroundColor: '#F1F3F4', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Botanical Bio</label>
              <textarea
                rows="2"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="form-textarea"
                placeholder="Share your botanical interests..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Quick Nav Cards */}
      <div className="profile-nav-grid" style={{ marginBottom: '2.5rem' }}>
        <Link
          to="/orders"
          style={{
            background: 'var(--color-white)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}
          className="card"
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'var(--color-soft-sage)',
              color: 'var(--color-primary-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Package size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-dark-green)' }}>
              My Orders
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
              {orders.length} order{orders.length !== 1 ? 's' : ''} recorded
            </div>
          </div>
        </Link>

        <Link
          to="/wishlist"
          style={{
            background: 'var(--color-white)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}
          className="card"
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#FCECEE',
              color: 'var(--color-error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Heart size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-dark-green)' }}>
              Saved Wishlist
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
              {wishlistCount} saved plant{wishlistCount !== 1 ? 's' : ''}
            </div>
          </div>
        </Link>

        <Link
          to="/faq"
          style={{
            background: 'var(--color-white)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}
          className="card"
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'var(--color-soft-sage)',
              color: 'var(--color-primary-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <HelpCircle size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-dark-green)' }}>
              Care Guide & FAQ
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
              Plant tips & help
            </div>
          </div>
        </Link>
      </div>

      {/* Saved Delivery Addresses */}
      <section
        className="profile-card"
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={22} color="var(--color-primary-green)" />
            <h2 style={{ fontSize: '1.35rem' }}>Saved Delivery Addresses</h2>
          </div>
          <Link to="/checkout" className="btn btn-secondary btn-sm">
            <Plus size={15} />
            <span>Add in Checkout</span>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-warm-cream)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--color-dark-green)' }}>{addr.fullName}</strong>
                  {addr.isDefault && <span className="badge badge-stock">Default Address</span>}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-primary-text)' }}>
                  {addr.house}, {addr.street}
                </div>
                {addr.landmark && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                    Near: {addr.landmark}
                  </div>
                )}
                <div style={{ fontSize: '0.9rem', color: 'var(--color-primary-text)' }}>
                  {addr.city}, {addr.state} — <strong>{addr.pincode}</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginTop: '0.2rem' }}>
                  Mobile: +91 {addr.phone}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(addr.id)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    Set as Default
                  </button>
                )}
                {addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteAddress(addr.id)}
                    className="nav-action-btn"
                    style={{ width: '36px', height: '36px', color: 'var(--color-error)' }}
                    title="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security note */}
      <div className="demo-banner">
        <ShieldCheck size={20} color="var(--color-primary-green)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Row Level Security Protected:</strong> Profile records are safeguarded by PostgreSQL RLS. Only you can view or update your personal account information. Administrative role elevation is strictly guarded server-side.
        </span>
      </div>
    </div>
  );
}
