// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Package,
  Home,
  Grid,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Announcement Strip */}
      <div className="announcement-bar">
        <span>Bring home a little more green 🌿</span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span>
          Free shipping on orders over <strong>₹799</strong>
        </span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Simulated Demo Store</span>
      </div>

      {/* Main Navbar */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <nav className="navbar">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Logo showTagline size="md" />

            {/* Desktop Navigation Links */}
            <ul className="nav-links">
              <li>
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Shop Plants
                </NavLink>
              </li>
              <li>
                <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  My Orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Care & FAQ
                </NavLink>
              </li>
            </ul>

            {/* Right Action Icons */}
            <div className="nav-actions">
              {/* Search Toggle */}
              <button
                type="button"
                className="nav-action-btn"
                onClick={() => setSearchOpen((prev) => !prev)}
                aria-label="Search plants"
              >
                <Search size={19} />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="nav-action-btn" aria-label={`Wishlist (${wishlistCount})`}>
                <Heart size={19} />
                {wishlistCount > 0 && <span className="nav-badge-count">{wishlistCount}</span>}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="nav-action-btn" aria-label={`Shopping Basket (${cartCount})`}>
                <ShoppingBag size={19} />
                {cartCount > 0 && <span className="nav-badge-count">{cartCount}</span>}
              </Link>

              {/* Profile */}
              <Link to="/profile" className="nav-action-btn" aria-label="Customer Profile">
                <User size={19} />
              </Link>
            </div>
          </nav>

          {/* Quick Search Dropdown Bar */}
          {searchOpen && (
            <div
              className="navbar-search-bar"
              style={{
                padding: '0.85rem 0 1.15rem',
                borderTop: '1px solid var(--color-border)',
                animation: 'slideUp 200ms ease-out'
              }}
            >
              <form onSubmit={handleSearchSubmit} className="navbar-search-form" style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                  <Search
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-secondary-text)'
                    }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search plants, care needs..."
                    className="form-input"
                    style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-pill)', width: '100%' }}
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="btn btn-ghost btn-sm"
                  aria-label="Cancel search"
                  style={{ flexShrink: 0 }}
                >
                  <X size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={closeMobileMenu} />
          <aside className="mobile-drawer" aria-label="Mobile Navigation">
            <div>
              <div className="mobile-drawer-header">
                <Logo size="sm" />
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--color-soft-sage)',
                    color: 'var(--color-dark-green)'
                  }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <ul className="mobile-drawer-links">
                <li>
                  <NavLink
                    to="/"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/shop"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <Sparkles size={18} />
                    <span>Shop All Plants</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/categories"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <Grid size={18} />
                    <span>Categories</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cart"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <ShoppingBag size={18} />
                    <span>Shopping Basket ({cartCount})</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wishlist"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <Heart size={18} />
                    <span>Wishlist ({wishlistCount})</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/orders"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <Package size={18} />
                    <span>My Orders</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <User size={18} />
                    <span>Guest Profile</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/faq"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <HelpCircle size={18} />
                    <span>Care Guide & FAQ</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Drawer Footer Notice */}
            <div
              style={{
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-border)',
                fontSize: '0.8rem',
                color: 'var(--color-secondary-text)'
              }}
            >
              <p style={{ fontWeight: 600, color: 'var(--color-dark-green)' }}>Nursury Demo</p>
              <p>Bringing Green Life to Your Home</p>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
