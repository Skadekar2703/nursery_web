// src/pages/admin/AdminProductForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  AlertCircle
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';

const PLANT_TYPES = [
  'Foliage Plant',
  'Air Purifier',
  'Flowering Plant',
  'Succulent',
  'Planter',
  'Garden Supply'
];

const LIGHT_REQUIREMENTS = [
  'Low Light',
  'Medium Indirect',
  'Bright Indirect',
  'Full Sun',
  'All Lighting'
];

const SIZES = ['Small', 'Medium', 'Large'];

export function AdminProductForm() {
  const { id } = useParams(); // If present -> Edit Mode; if absent -> Add Mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    stockQuantity: 15,
    isActive: true,
    imageUrl: '/images/onboarding_plant.jpg',
    plantType: 'Foliage Plant',
    lightRequirement: 'Bright Indirect',
    size: 'Medium',
    watering: 'Once a week when topsoil dries',
    tagsInput: 'Air Purifying, Indoor Plant',
    // Care guide
    careLight: 'Thrives in medium to bright indirect sunlight.',
    careWatering: 'Allow top 2 inches of soil to dry out between waterings.',
    careSoil: 'Rich, well-aerated potting mix with perlite.',
    carePetFriendly: false,
    careRepotting: 'Repot every 18 to 24 months into a container with drainage holes.',
    careTip: 'Gently wipe leaves with a damp cloth every fortnight.',
    // Flags
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    isBeginnerFriendly: true,
    isLowLight: false,
    isSeasonal: false
  });

  // Load Categories & Existing Product (if editing)
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const catRes = await categoryService.getCategories({ activeOnly: false });
        if (mounted && catRes.data) {
          setCategories(catRes.data);
          // Set default category for Add mode
          if (!isEditMode && catRes.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              categoryId: catRes.data[0].id || catRes.data[0].slug
            }));
          }
        }

        if (isEditMode) {
          const prodRes = await productService.getProductBySlug(id);
          if (mounted && prodRes.data) {
            const p = prodRes.data;
            setFormData({
              name: p.name || '',
              slug: p.slug || '',
              description: p.description || '',
              price: p.price !== undefined ? String(p.price) : '',
              originalPrice: p.originalPrice ? String(p.originalPrice) : '',
              categoryId: p.categoryId || (catRes.data?.[0]?.id || 'indoor-plants'),
              stockQuantity: p.stockQuantity !== undefined ? p.stockQuantity : 15,
              isActive: p.is_active !== false && p.isActive !== false,
              imageUrl: p.imageUrl || p.image || '/images/onboarding_plant.jpg',
              plantType: p.plantType || 'Foliage Plant',
              lightRequirement: p.lightRequirement || 'Bright Indirect',
              size: p.size || 'Medium',
              watering: p.watering || 'Once a week',
              tagsInput: Array.isArray(p.tags) ? p.tags.join(', ') : '',
              // Care Guide
              careLight: p.careGuide?.light || '',
              careWatering: p.careGuide?.watering || '',
              careSoil: p.careGuide?.soil || '',
              carePetFriendly: !!p.careGuide?.petFriendly,
              careRepotting: p.careGuide?.repotting || '',
              careTip: p.careGuide?.tip || '',
              // Flags
              isFeatured: !!p.isFeatured,
              isBestseller: !!p.isBestseller,
              isNewArrival: !!p.isNewArrival,
              isBeginnerFriendly: !!p.isBeginnerFriendly,
              isLowLight: !!p.isLowLight,
              isSeasonal: !!p.isSeasonal
            });
          } else if (mounted) {
            setErrorMsg('Could not find the requested plant product.');
          }
        }
      } catch (err) {
        console.error('Failed to initialize product form:', err);
        if (mounted) setErrorMsg('Failed to load initial data.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: val };

      // Auto-generate slug when name changes (if creating new product)
      if (!isEditMode && name === 'name') {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      return updated;
    });

    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Form Validations
    if (!formData.name.trim()) {
      setErrorMsg('Please specify a plant name.');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMsg('Price must be greater than zero.');
      return;
    }

    if (Number(formData.stockQuantity) < 0) {
      setErrorMsg('Stock quantity cannot be negative.');
      return;
    }

    const tagsArray = formData.tagsInput
      ? formData.tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const matchedCategory = categories.find(
      (c) => c.id === formData.categoryId || c.slug === formData.categoryId
    );

    const payload = {
      name: formData.name.trim(),
      slug:
        formData.slug.trim() ||
        formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: formData.description.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      categoryId: formData.categoryId,
      category: matchedCategory?.name || 'Indoor Plants',
      stockQuantity: Number(formData.stockQuantity),
      stock_quantity: Number(formData.stockQuantity),
      isActive: formData.isActive,
      is_active: formData.isActive,
      imageUrl: formData.imageUrl.trim() || '/images/onboarding_plant.jpg',
      plantType: formData.plantType,
      lightRequirement: formData.lightRequirement,
      size: formData.size,
      watering: formData.watering,
      tags: tagsArray,
      isFeatured: formData.isFeatured,
      isBestseller: formData.isBestseller,
      isNewArrival: formData.isNewArrival,
      isBeginnerFriendly: formData.isBeginnerFriendly,
      isLowLight: formData.isLowLight,
      isSeasonal: formData.isSeasonal,
      careGuide: {
        light: formData.careLight,
        watering: formData.careWatering,
        soil: formData.careSoil,
        petFriendly: formData.carePetFriendly,
        repotting: formData.careRepotting,
        tip: formData.careTip
      }
    };

    setSubmitting(true);

    let result;
    if (isEditMode) {
      result = await productService.updateProduct(id, payload);
    } else {
      result = await productService.createProduct(payload);
    }

    setSubmitting(false);

    if (result.data) {
      addToast(
        isEditMode
          ? `Updated "${payload.name}" successfully!`
          : `Added "${payload.name}" to the catalog!`,
        'success'
      );
      navigate('/admin/products');
    } else {
      setErrorMsg(result.error || 'Failed to save product. Please verify inputs.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-primary-green)', fontWeight: 600 }}>
          Loading plant product data...
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <Link
            to="/admin/products"
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: '0.5rem', paddingLeft: 0, display: 'inline-flex', gap: '0.35rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </Link>
          <h1>{isEditMode ? `Edit Plant: ${formData.name}` : 'Add New Plant Product'}</h1>
          <p>
            {isEditMode
              ? 'Update specifications, pricing, inventory count, and visibility.'
              : 'Add a new botanical specimen or accessory to the Nursury collection.'}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="auth-error-banner" role="alert" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>{errorMsg}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">1. Essential Plant Details</h2>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="plant-name">
                  Plant Name <span className="required">*</span>
                </label>
                <input
                  id="plant-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Calathea Orbifolia"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="plant-slug">
                  URL Slug <span className="required">*</span>
                </label>
                <input
                  id="plant-slug"
                  name="slug"
                  type="text"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. calathea-orbifolia"
                  className="form-input"
                />
                <span className="form-hint">Unique identifier used in URL (/product/{formData.slug || 'slug'})</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="plant-description">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="plant-description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe botanical foliage, aesthetic highlights, origin, and characteristics..."
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="plant-category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="plant-category"
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="form-select"
                >
                  {categories.map((c) => (
                    <option key={c.id || c.slug} value={c.id || c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="plant-type">
                  Plant Type
                </label>
                <select
                  id="plant-type"
                  name="plantType"
                  value={formData.plantType}
                  onChange={handleChange}
                  className="form-select"
                >
                  {PLANT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="plant-size">
                  Size
                </label>
                <select
                  id="plant-size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="form-select"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">2. Pricing & Stock Control</h2>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="plant-price">
                  Selling Price (₹) <span className="required">*</span>
                </label>
                <input
                  id="plant-price"
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 599"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="plant-original-price">
                  Original / MRP Price (₹)
                </label>
                <input
                  id="plant-original-price"
                  name="originalPrice"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="e.g. 799 (Optional for discount)"
                  className="form-input"
                />
                <span className="form-hint">Shows crossed-out discount badge</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="plant-stock">
                  Stock Units <span className="required">*</span>
                </label>
                <input
                  id="plant-stock"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  className="form-input"
                />
                <span className="form-hint">≤ 5 triggers low-stock alerts</span>
              </div>
            </div>

            {/* Active Switch */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: 'var(--color-sage-subtle)',
                borderRadius: 'var(--radius-md)',
                marginTop: '0.5rem'
              }}
            >
              <input
                id="is-active-toggle"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)' }}
              />
              <label htmlFor="is-active-toggle" style={{ cursor: 'pointer', fontWeight: 600 }}>
                Active for Customer Purchase
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginLeft: 'auto' }}>
                Uncheck to hide from public store without breaking past order records
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Imagery */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">3. Plant Photography & Image</h2>
          </div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label" htmlFor="plant-image-url">
                Image URL or Local Asset Path <span className="required">*</span>
              </label>
              <input
                id="plant-image-url"
                name="imageUrl"
                type="text"
                required
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="/images/plant_snake.jpg or https://images.unsplash.com/..."
                className="form-input"
              />
            </div>

            {/* Live Image Preview */}
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-soft-sage)',
                  border: '1px solid var(--color-border)',
                  flexShrink: 0
                }}
              >
                <img
                  src={formData.imageUrl || '/images/onboarding_plant.jpg'}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/onboarding_plant.jpg';
                  }}
                />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                <strong>Image Preview:</strong> Ensure photos show vibrant foliage with natural light, clean pots, or tranquil botanical settings.
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Care Guide */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">4. Botanical Care Guide</h2>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="care-light-req">
                  Light Requirement
                </label>
                <select
                  id="care-light-req"
                  name="lightRequirement"
                  value={formData.lightRequirement}
                  onChange={handleChange}
                  className="form-select"
                >
                  {LIGHT_REQUIREMENTS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="care-watering-short">
                  Watering Frequency (Summary)
                </label>
                <input
                  id="care-watering-short"
                  name="watering"
                  type="text"
                  value={formData.watering}
                  onChange={handleChange}
                  placeholder="e.g. Once a week when topsoil dries"
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="care-light">
                  Light Instructions
                </label>
                <input
                  id="care-light"
                  name="careLight"
                  type="text"
                  value={formData.careLight}
                  onChange={handleChange}
                  placeholder="e.g. Thrives in medium to bright indirect sunlight."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="care-soil">
                  Soil Blend Recommendation
                </label>
                <input
                  id="care-soil"
                  name="careSoil"
                  type="text"
                  value={formData.careSoil}
                  onChange={handleChange}
                  placeholder="e.g. Fast-draining potting mix with perlite."
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="care-tip">
                  Botanical Pro-Tip
                </label>
                <input
                  id="care-tip"
                  name="careTip"
                  type="text"
                  value={formData.careTip}
                  onChange={handleChange}
                  placeholder="e.g. Mist leaves weekly during hot dry seasons."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="care-repotting">
                  Repotting Timeline
                </label>
                <input
                  id="care-repotting"
                  name="careRepotting"
                  type="text"
                  value={formData.careRepotting}
                  onChange={handleChange}
                  placeholder="e.g. Repot every 18-24 months in spring."
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <input
                id="care-pet-friendly"
                name="carePetFriendly"
                type="checkbox"
                checked={formData.carePetFriendly}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)' }}
              />
              <label htmlFor="care-pet-friendly" style={{ cursor: 'pointer', fontWeight: 600 }}>
                🐾 Pet Friendly (Non-toxic to cats & dogs)
              </label>
            </div>
          </div>
        </div>

        {/* Section 5: Badges & Tags */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">5. Badges, Merchandising & Tags</h2>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="tags-input">
                Search & Filter Tags (Comma-separated)
              </label>
              <input
                id="tags-input"
                name="tagsInput"
                type="text"
                value={formData.tagsInput}
                onChange={handleChange}
                placeholder="Air Purifying, Low Maintenance, Balcony, Bedroom Safe"
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--color-primary-green)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Featured on Homepage</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isBestseller"
                  checked={formData.isBestseller}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--color-primary-green)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Bestseller Badge</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--color-primary-green)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>New Arrival</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isBeginnerFriendly"
                  checked={formData.isBeginnerFriendly}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--color-primary-green)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Beginner Friendly</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isLowLight"
                  checked={formData.isLowLight}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--color-primary-green)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Low Light Tolerant</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isSeasonal"
                  checked={formData.isSeasonal}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--color-primary-green)' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Seasonal Collection</span>
              </label>
            </div>
          </div>
        </div>

        {/* Form Submit Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
            padding: '1.5rem',
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '3rem'
          }}
        >
          <Link to="/admin/products" className="btn btn-secondary">
            Cancel
          </Link>

          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ minWidth: '180px' }}>
            {submitting ? (
              <span>Saving Plant...</span>
            ) : (
              <>
                <Save size={17} />
                <span>{isEditMode ? 'Save Plant Changes' : 'Publish Plant to Catalog'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
