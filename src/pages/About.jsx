// src/pages/About.jsx
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ShieldCheck, ArrowRight, Sun, Sprout } from 'lucide-react';

export function About() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem' }}>
        <div
          style={{
            fontSize: '0.825rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-accent-green)',
            marginBottom: '0.5rem'
          }}
        >
          Our Botanical Philosophy
        </div>
        <h1>About Nursury</h1>
        <p style={{ marginTop: '0.75rem', fontSize: '1.1rem', color: 'var(--color-secondary-text)', lineHeight: 1.6 }}>
          Bringing green life into modern homes. We believe everyone deserves to share their everyday sanctuary with living, breathing foliage.
        </p>
      </div>

      {/* Two Column Story Section */}
      <div className="about-story-grid" style={{ marginBottom: '5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>
            Nurtured With Care, Grown For Life
          </h2>
          <p style={{ color: 'var(--color-primary-text)', opacity: 0.88, lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '1rem' }}>
            Nursury was founded with a singular conviction: plants aren't mere decorations—they are quiet, loyal companions that enrich our health, clear indoor toxins, reduce stress, and restore our innate connection with nature.
          </p>
          <p style={{ color: 'var(--color-primary-text)', opacity: 0.88, lineHeight: 1.7, marginBottom: '1.75rem', fontSize: '1rem' }}>
            Every plant in our greenhouse is grown in nutrient-dense potting soil, acclimatized to Indian domestic temperatures, and carefully checked for healthy roots and vibrant foliage before being safely packed.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>
              <Sparkles size={18} color="var(--color-primary-green)" />
              <span>100% Acclimatized</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>
              <ShieldCheck size={18} color="var(--color-primary-green)" />
              <span>Eco-Friendly Packaging</span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div
            style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '6px solid var(--color-white)',
              aspectRatio: '4 / 3'
            }}
          >
            <img
              src="/images/onboarding_plant.jpg"
              alt="Lush Monstera Deliciosa in handcrafted ceramic planter"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Our Guiding Principles</h2>
        <div className="about-values-grid">
          <div
            style={{
              background: 'var(--color-white)',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--color-soft-sage)',
                color: 'var(--color-primary-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Sprout size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Botanical Integrity</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              We never ship forced greenhouse specimens. Each plant develops natural resilience and genuine vitality.
            </p>
          </div>

          <div
            style={{
              background: 'var(--color-white)',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--color-soft-sage)',
                color: 'var(--color-primary-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Heart size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Lifetime Care Support</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Plant parenthood shouldn't feel stressful. We share thorough lighting, repotting, and hydration advice freely.
            </p>
          </div>

          <div
            style={{
              background: 'var(--color-white)',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--color-soft-sage)',
                color: 'var(--color-primary-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Sun size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Sustainable Horizons</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              From biodegradable cocopeat to handmade earthenware terracotta, our materials celebrate nature.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-dark-green) 0%, var(--color-primary-green) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          color: '#FFFFFF'
        }}
      >
        <h2 style={{ color: '#FFFFFF', marginBottom: '0.75rem' }}>Ready to welcome green life?</h2>
        <p style={{ color: '#D0E5D7', maxWidth: '540px', margin: '0 auto 2rem', fontSize: '1rem' }}>
          Explore our complete collection of 24+ healthy indoor and outdoor plant varieties today.
        </p>
        <Link to="/shop" className="btn btn-secondary btn-lg">
          <span>Explore Catalog</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
