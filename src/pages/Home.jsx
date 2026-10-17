import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  HeartHandshake,
  CheckCircle2,
  Send
} from 'lucide-react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categories';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryCard } from '../components/category/CategoryCard';
import { useToast } from '../context/ToastContext';

export function Home() {
  const { addToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      productService.getProducts({ activeOnly: true }),
      categoryService.getCategories({ activeOnly: true })
    ]).then(([prodRes, catRes]) => {
      if (mounted) {
        if (prodRes.data && prodRes.data.length > 0) setProducts(prodRes.data);
        if (catRes.data && catRes.data.length > 0) setCategories(catRes.data);
      }
    }).catch((err) => {
      console.warn('Could not load dynamic products on Home:', err);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Filtered collections from live catalog (active products only)
  const activeProducts = products.filter((p) => p.is_active !== false && p.isActive !== false);
  const featuredProducts = activeProducts.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = activeProducts.filter((p) => p.isBestseller).slice(0, 4);
  const newArrivals = activeProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const beginnerFriendly = activeProducts.filter((p) => p.isBeginnerFriendly).slice(0, 4);
  const lowLightPlants = activeProducts.filter((p) => p.isLowLight).slice(0, 4);
  const seasonalPicks = activeProducts.filter((p) => p.isSeasonal).slice(0, 4);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setNewsletterDone(true);
    addToast('Thank you! You are subscribed to weekly plant-care tips (Demo)', 'success');
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          padding: '3rem 0 4.5rem',
          background: 'linear-gradient(180deg, rgba(229, 239, 227, 0.45) 0%, rgba(250, 248, 240, 0) 100%)'
        }}
      >
        <div className="container">
          <div className="hero-grid">
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--color-soft-sage)',
                  color: 'var(--color-primary-green)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                <Leaf size={15} />
                <span>Premium Botanical Nursery</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                  fontWeight: 800,
                  color: 'var(--color-dark-green)',
                  lineHeight: 1.15,
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.03em'
                }}
              >
                Bring Nature <span style={{ color: 'var(--color-accent-green)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600 }}>Home</span>
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-primary-text)',
                  opacity: 0.85,
                  lineHeight: 1.6,
                  maxWidth: '520px',
                  marginBottom: '2rem'
                }}
              >
                Discover farm-fresh, healthy potted houseplants, air purifiers, and handcrafted planters delivered with love to breathe serenity into your living spaces.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <span>Shop Plants</span>
                  <ArrowRight size={18} />
                </Link>
                <a href="#categories" className="btn btn-secondary btn-lg">
                  <span>Explore Categories</span>
                </a>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  marginTop: '2.5rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--color-border)',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-primary-text)', fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="var(--color-success)" />
                  <span>Healthy Plant Guarantee</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-primary-text)', fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="var(--color-success)" />
                  <span>Free Shipping over ₹799</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-primary-text)', fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="var(--color-success)" />
                  <span>Lifetime Care Guidance</span>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-float)',
                  border: '6px solid var(--color-white)',
                  aspectRatio: '4 / 3',
                  background: 'var(--color-soft-sage)'
                }}
              >
                <img
                  src="/images/banner_nature.jpg"
                  alt="Lush houseplants including Monstera and Snake Plant bathed in bright morning sunlight"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <div
                className="hero-floating-badge"
                style={{
                  position: 'absolute',
                  bottom: '-1rem',
                  left: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  zIndex: 2
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--color-soft-sage)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-green)'
                  }}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>
                    24+ Curated Species
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                    Farm-acclimatized for home growth
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section id="categories" style={{ padding: '4.5rem 0 3.5rem' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
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
                  marginBottom: '0.4rem'
                }}
              >
                Browse Our Greenhouse
              </div>
              <h2>Botanical Collections</h2>
            </div>
            <Link to="/categories" className="btn btn-outline btn-sm">
              <span>View All Categories</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id || cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
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
                  marginBottom: '0.4rem'
                }}
              >
                Handpicked Favorites
              </div>
              <h2>Featured Plants</h2>
            </div>
            <Link to="/shop?filter=featured" className="btn btn-outline btn-sm">
              <span>See All Featured</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS SECTION */}
      <section
        style={{
          padding: '4rem 0',
          background: 'linear-gradient(180deg, rgba(229, 239, 227, 0.3) 0%, rgba(250, 248, 240, 0.8) 100%)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
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
                  marginBottom: '0.4rem'
                }}
              >
                Loved by Plant Parents
              </div>
              <h2>Best Sellers</h2>
            </div>
            <Link to="/shop?sort=best-rated" className="btn btn-outline btn-sm">
              <span>Explore Best Sellers</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS SECTION */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
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
                  marginBottom: '0.4rem'
                }}
              >
                Fresh from the Greenhouse
              </div>
              <h2>New Arrivals</h2>
            </div>
            <Link to="/shop?sort=newest" className="btn btn-outline btn-sm">
              <span>View All New</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. PLANTS FOR BEGINNERS */}
      <section
        style={{
          padding: '4rem 0',
          background: 'var(--color-white)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
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
                  marginBottom: '0.4rem'
                }}
              >
                Effortless Greens
              </div>
              <h2>Plants for Beginners</h2>
              <p style={{ marginTop: '0.25rem', fontSize: '0.95rem' }}>
                Resilient, forgiving plants that thrive even if you occasionally forget to water.
              </p>
            </div>
            <Link to="/shop" className="btn btn-outline btn-sm">
              <span>Shop All Easy-Care</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-4">
            {beginnerFriendly.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. LOW-LIGHT & SEASONAL PICKS */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-accent-green)',
                marginBottom: '0.4rem'
              }}
            >
              Curated For Every Lighting Need
            </div>
            <h2>Low-Light Champions & Seasonal Picks</h2>
          </div>

          <div className="grid-4">
            {lowLightPlants.concat(seasonalPicks).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. BENEFITS SECTION */}
      <section
        style={{
          padding: '4.5rem 0',
          background: 'linear-gradient(135deg, var(--color-dark-green) 0%, var(--color-primary-green) 100%)',
          color: '#FFFFFF'
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <div
              style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#A3E4B8',
                marginBottom: '0.6rem'
              }}
            >
              The Nursury Promise
            </div>
            <h2 style={{ color: '#FFFFFF', marginBottom: '0.75rem' }}>Why Choose Nursury?</h2>
            <p style={{ color: '#D0E5D7', fontSize: '1rem' }}>
              We bring botanical excellence, transparent plant guidance, and delightful simulated shopping to plant lovers nationwide.
            </p>
          </div>

          <div className="benefits-grid">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(163, 228, 184, 0.2)',
                  color: '#A3E4B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Leaf size={24} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Carefully Selected Plants
              </h3>
              <p style={{ color: '#D0E5D7', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Every specimen is hand-nurtured in organic nursery soil, ensuring vigorous root systems and pest-free foliage.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(163, 228, 184, 0.2)',
                  color: '#A3E4B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Plant-Care Guidance
              </h3>
              <p style={{ color: '#D0E5D7', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Detailed water, light, and soil instructions accompany each plant to give every new parent total confidence.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(163, 228, 184, 0.2)',
                  color: '#A3E4B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Safe Demo Checkout
              </h3>
              <p style={{ color: '#D0E5D7', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Simulate shopping with simulated UPI, Cards, and Cash on Delivery with complete privacy and zero real billing.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(163, 228, 184, 0.2)',
                  color: '#A3E4B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Truck size={24} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Easy Browsing
              </h3>
              <p style={{ color: '#D0E5D7', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Effortless multi-filtering by room, light requirements, size, and category on desktop, tablet, and mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER / PLANT TIPS SIGNUP */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div
            className="newsletter-card"
            style={{
              background: 'var(--color-soft-sage)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2rem',
              textAlign: 'center',
              maxWidth: '720px',
              margin: '0 auto',
              border: '1px solid #D1E2CF'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--color-white)',
                color: 'var(--color-primary-green)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Leaf size={22} />
            </div>

            <h2 style={{ marginBottom: '0.5rem' }}>Join the Nursury Green Club</h2>
            <p style={{ maxWidth: '520px', margin: '0 auto 1.75rem', fontSize: '0.95rem' }}>
              Receive monthly seasonal watering schedules, pruning guides, and plant styling tips directly to your inbox.
            </p>

            {newsletterDone ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--color-white)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--color-success)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: '1px solid #C0DEC8'
                }}
              >
                <CheckCircle2 size={18} />
                <span>Subscribed! Check your local browser feedback (Demo only).</span>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  maxWidth: '460px',
                  margin: '0 auto',
                  flexWrap: 'wrap'
                }}
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="form-input"
                  style={{
                    flex: '1 1 240px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--color-white)'
                  }}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                  <span>Get Tips</span>
                  <Send size={15} />
                </button>
              </form>
            )}

            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '1rem' }}>
              * Demonstration only. No emails are transmitted over the internet.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
