// src/pages/Categories.jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { CategoryCard } from '../components/category/CategoryCard';
import { ProductCard } from '../components/product/ProductCard';

export function Categories() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
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
          Botanical Collections
        </div>
        <h1>Explore Plant Categories</h1>
        <p style={{ marginTop: '0.6rem', fontSize: '1.05rem', color: 'var(--color-secondary-text)' }}>
          Whether you have a sunlit balcony, a dim home office, or a cozy windowsill, browse our six dedicated botanical departments.
        </p>
      </div>

      {/* Grid of 6 Categories */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}
      >
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* Category Deep Dives with Sample Products */}
      {CATEGORIES.map((cat) => {
        const catProducts = PRODUCTS.filter((p) => p.categoryId === cat.slug).slice(0, 4);
        if (catProducts.length === 0) return null;

        return (
          <section key={cat.id} style={{ marginBottom: '4rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: '1.75rem',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--color-border)'
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-accent-green)'
                  }}
                >
                  {cat.tagline}
                </span>
                <h2 style={{ fontSize: '1.6rem', marginTop: '0.2rem' }}>{cat.name}</h2>
              </div>
              <Link to={`/shop?category=${cat.slug}`} className="btn btn-outline btn-sm">
                <span>View all {cat.count} {cat.name}</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid-4">
              {catProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
