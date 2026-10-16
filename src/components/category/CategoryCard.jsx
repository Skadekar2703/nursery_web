// src/components/category/CategoryCard.jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="category-card"
      aria-label={`Explore ${category.name}`}
    >
      <div className="category-card-img-wrapper">
        <img
          src={category.image}
          alt={category.name}
          className="category-card-img"
          loading="lazy"
        />
        {category.badge && (
          <span
            className="badge badge-sage"
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)'
            }}
          >
            {category.badge}
          </span>
        )}
      </div>

      <div className="category-card-content">
        <h3 className="category-card-title">{category.name}</h3>
        <p className="category-card-desc">{category.description}</p>
        <div className="category-card-footer">
          <span>{category.count} Botanical Varieties</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
