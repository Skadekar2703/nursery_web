// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Logo } from '../common/Logo';

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-dark-green)',
        color: '#E5EFE3',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        marginTop: '5rem',
        borderTop: '1px solid #1A4D35'
      }}
    >
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <Logo variant="white" showTagline size="md" />
            <p
              style={{
                color: '#C0D4C5',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                marginTop: '1.25rem'
              }}
            >
              Curating healthy, farm-grown botanical companions for mindful homes, sunny balconies, and modern workspaces.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                marginTop: '1.25rem',
                fontSize: '0.78rem',
                color: '#A3E4B8'
              }}
            >
              <Sparkles size={14} />
              <span>100% Guaranteed Healthy Plants</span>
            </div>
          </div>

          {/* Botanical Collections */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '1.05rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                letterSpacing: '0.02em'
              }}
            >
              Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/shop?category=indoor-plants" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Indoor Air Purifiers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=outdoor-plants" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Outdoor & Balcony Palms
                </Link>
              </li>
              <li>
                <Link to="/shop?category=flowering-plants" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Flowering & Fragrant Blooms
                </Link>
              </li>
              <li>
                <Link to="/shop?category=succulents" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Sculptural Succulents
                </Link>
              </li>
              <li>
                <Link to="/shop?category=pots-planters" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Handcrafted Planters
                </Link>
              </li>
              <li>
                <Link to="/shop?category=gardening-essentials" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Organic Soil & Plant Food
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Help & Navigation */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '1.05rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                letterSpacing: '0.02em'
              }}
            >
              Customer Care
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/faq" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Plant Care Guide & Tips
                </Link>
              </li>
              <li>
                <Link to="/orders" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Track Demo Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Guest Profile & Addresses
                </Link>
              </li>
              <li>
                <Link to="/faq" style={{ color: '#C0D4C5', fontSize: '0.9rem' }}>
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Sample Contact Information */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '1.05rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                letterSpacing: '0.02em'
              }}
            >
              Sample Studio
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: '#C0D4C5', fontSize: '0.875rem' }}>
                <MapPin size={17} style={{ flexShrink: 0, marginTop: '2px', color: '#A3E4B8' }} />
                <span>Nursury Greenhouse Botanical Hub, 100ft Road, Indiranagar, Bengaluru, KA 560038</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#C0D4C5', fontSize: '0.875rem' }}>
                <Phone size={17} style={{ flexShrink: 0, color: '#A3E4B8' }} />
                <span>+91 98765 43210 (Demo Contact)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#C0D4C5', fontSize: '0.875rem' }}>
                <Mail size={17} style={{ flexShrink: 0, color: '#A3E4B8' }} />
                <span>hello@nursury-botanicals.demo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Disclaimer Box */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(229, 239, 227, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <ShieldCheck size={24} style={{ color: '#A3E4B8', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: '260px', fontSize: '0.825rem', color: '#C0D4C5', lineHeight: 1.5 }}>
            <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '2px' }}>
              Demonstration & Portfolio Notice:
            </strong>
            This is a mock e-commerce client demonstration built with React & Vite. No actual transactions, live credit card processing, deliveries, or remote backends are involved.
          </div>
        </div>

        {/* Bottom Copyright & Made with Love */}
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.825rem',
            color: '#8CA595'
          }}
        >
          <div>
            © {new Date().getFullYear()} Nursury. All botanical trademarks simulated for demonstration.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted with</span>
            <Heart size={14} style={{ fill: '#E24B6A', color: '#E24B6A' }} />
            <span>for botanical plant enthusiasts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
