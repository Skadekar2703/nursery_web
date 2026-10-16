// src/pages/Shop.jsx
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';

const PLANT_TYPES = [
  'All Types',
  'Foliage Plant',
  'Air Purifier',
  'Flowering Plant',
  'Succulent',
  'Planter',
  'Garden Supply'
];

const LIGHT_REQUIREMENTS = [
  'All Lighting',
  'Low Light',
  'Medium Indirect',
  'Bright Indirect',
  'Full Sun'
];

const SIZES = ['All Sizes', 'Small', 'Medium', 'Large'];

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read search, category, and sort directly from searchParams for clean browser back/forward support
  const searchTerm = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'recommended';

  // Local filter states
  const [selectedPlantType, setSelectedPlantType] = useState('All Types');
  const [selectedLight, setSelectedLight] = useState('All Lighting');
  const [selectedSize, setSelectedSize] = useState('All Sizes');
  const [maxPrice, setMaxPrice] = useState(1200);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const setSearchTerm = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set('q', value);
      } else {
        next.delete('q');
      }
      return next;
    });
  };

  const setSelectedCategory = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') {
        next.set('category', value);
      } else {
        next.delete('category');
      }
      return next;
    });
  };

  const setSortBy = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'recommended') {
        next.set('sort', value);
      } else {
        next.delete('sort');
      }
      return next;
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedPlantType !== 'All Types') count++;
    if (selectedLight !== 'All Lighting') count++;
    if (selectedSize !== 'All Sizes') count++;
    if (maxPrice < 1200) count++;
    if (searchTerm.trim()) count++;
    return count;
  }, [selectedCategory, selectedPlantType, selectedLight, selectedSize, maxPrice, searchTerm]);

  const resetFilters = () => {
    setSelectedPlantType('All Types');
    setSelectedLight('All Lighting');
    setSelectedSize('All Sizes');
    setMaxPrice(1200);
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.plantType.toLowerCase().includes(q) ||
          p.lightRequirement.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
        );
      });
    }

    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.categoryId === selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedPlantType !== 'All Types') {
      result = result.filter((p) => p.plantType === selectedPlantType);
    }

    if (selectedLight !== 'All Lighting') {
      result = result.filter((p) => p.lightRequirement === selectedLight);
    }

    if (selectedSize !== 'All Sizes') {
      result = result.filter((p) => p.size === selectedSize);
    }

    result = result.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'best-rated':
        result.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
        break;
      case 'recommended':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [searchTerm, selectedCategory, selectedPlantType, selectedLight, selectedSize, maxPrice, sortBy]);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
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
          Explore All Botanical Specimens
        </div>
        <h1>The Plant Shop</h1>
        <p style={{ marginTop: '0.4rem', fontSize: '1rem', maxWidth: '650px' }}>
          Browse our handpicked varieties of indoor greens, balcony flowering wonders, architectural palms, and organic plant care essentials.
        </p>
      </div>

      <div
        style={{
          background: 'var(--color-white)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '220px' }}>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by plant name, care need, or category..."
            className="form-input"
            style={{ paddingLeft: '2.75rem', paddingRight: '2.5rem', borderRadius: 'var(--radius-pill)' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-secondary-text)'
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex' }}
            onClick={() => setMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span
                style={{
                  background: 'var(--color-primary-green)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem'
                }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', fontWeight: 600 }}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.875rem',
                fontWeight: 600,
                width: 'auto'
              }}
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="best-rated">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2.5rem',
          alignItems: 'start'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary-text)' }}>
            Showing <strong style={{ color: 'var(--color-dark-green)' }}>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'plant' : 'plants'}
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem',
                color: 'var(--color-error)',
                fontWeight: 600
              }}
            >
              <RotateCcw size={14} />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            type="search"
            title="No Matching Plants Found"
            message="We couldn't find any botanical specimens matching your exact filter criteria. Try adjusting your search keywords or resetting filters."
            actionText="Reset All Filters"
            onActionClick={resetFilters}
          />
        )}
      </div>

      {mobileFilterOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMobileFilterOpen(false)} />
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '90%',
              maxWidth: '380px',
              background: 'var(--color-warm-cream)',
              zIndex: 300,
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideInLeft 200ms ease-out',
              overflowY: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={20} color="var(--color-primary-green)" />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-dark-green)' }}>Filter Catalog</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--color-soft-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-dark-green)'
                }}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                <option value="all">All Categories (6)</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Plant Type</label>
              <select
                value={selectedPlantType}
                onChange={(e) => setSelectedPlantType(e.target.value)}
                className="form-select"
              >
                {PLANT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Light Requirement</label>
              <select
                value={selectedLight}
                onChange={(e) => setSelectedLight(e.target.value)}
                className="form-select"
              >
                {LIGHT_REQUIREMENTS.map((light) => (
                  <option key={light} value={light}>
                    {light}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Plant Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="form-select"
              >
                {SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Max Price</label>
                <span style={{ fontWeight: 700, color: 'var(--color-primary-green)' }}>
                  ₹{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="1200"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--color-primary-green)',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                <span>₹200</span>
                <span>₹1,200</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-secondary btn-block"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="btn btn-primary btn-block"
              >
                View ({filteredProducts.length})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
