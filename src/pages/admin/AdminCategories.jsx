import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

export function AdminCategories() {
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '/images/cat_indoor.jpg',
    badge: 'Popular',
    tagline: 'Lush Living Decor',
    is_active: true,
    sort_order: 1
  });
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState(null);
  const [assignedCount, setAssignedCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        categoryService.getCategories({ activeOnly: false }),
        productService.getProducts({ activeOnly: false })
      ]);
      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      categoryService.getCategories({ activeOnly: false }),
      productService.getProducts({ activeOnly: false })
    ])
      .then(([catRes, prodRes]) => {
        if (mounted) {
          setCategories(catRes.data || []);
          setProducts(prodRes.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error('Failed to load categories:', err);
          addToast('Failed to load categories', 'error');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [addToast]);

  const handleRefresh = async () => {
    setLoading(true);
    await loadData();
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '/images/cat_indoor.jpg',
      badge: 'Popular',
      tagline: 'Botanical Collection',
      is_active: true,
      sort_order: categories.length + 1
    });
    setModalError('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image_url: cat.image_url || cat.image || '/images/cat_indoor.jpg',
      badge: cat.badge || '',
      tagline: cat.tagline || '',
      is_active: cat.is_active !== false,
      sort_order: cat.sort_order || 1
    });
    setModalError('');
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const next = { ...prev, [name]: val };
      if (!editingCategory && name === 'name') {
        next.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      return next;
    });
    if (modalError) setModalError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setModalError('Please specify a category name.');
      return;
    }

    setSaving(true);
    let result;
    if (editingCategory) {
      result = await categoryService.updateCategory(editingCategory.id || editingCategory.slug, formData);
    } else {
      result = await categoryService.createCategory(formData);
    }
    setSaving(false);

    if (result.data) {
      addToast(
        editingCategory
          ? `Updated "${formData.name}" successfully!`
          : `Created "${formData.name}" collection!`,
        'success'
      );
      setModalOpen(false);
      loadData();
    } else {
      setModalError(result.error || 'Failed to save category.');
    }
  };

  const handleToggleActive = async (cat) => {
    const nextState = cat.is_active === false ? true : false;
    const res = await categoryService.updateCategory(cat.id || cat.slug, {
      is_active: nextState
    });

    if (res.data) {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id || c.slug === cat.slug ? { ...c, is_active: nextState } : c))
      );
      addToast(`Category is now ${nextState ? 'Active' : 'Deactivated'}`, 'success');
    } else {
      addToast(res.error || 'Failed to update category', 'error');
    }
  };

  const promptDeleteCategory = (cat) => {
    const count = products.filter(
      (p) => p.categoryId === cat.slug || p.categoryId === cat.id || p.category === cat.name
    ).length;
    setTargetCategory(cat);
    setAssignedCount(count);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!targetCategory) return;

    if (assignedCount > 0) {
      // Soft deactivate instead to prevent broken product references
      await categoryService.updateCategory(targetCategory.id || targetCategory.slug, {
        is_active: false
      });
      addToast(
        `"${targetCategory.name}" has ${assignedCount} assigned plants. Deactivated instead to protect catalog integrity.`,
        'info'
      );
    } else {
      await categoryService.deleteCategory(targetCategory.id || targetCategory.slug);
      addToast(`Category "${targetCategory.name}" removed successfully.`, 'info');
    }

    setDeleteModalOpen(false);
    setTargetCategory(null);
    loadData();
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <h1>Botanical Categories</h1>
          <p>Organize plants into curated departments, taglines, and customer collections.</p>
        </div>

        <div className="admin-actions">
          <button
            type="button"
            onClick={handleRefresh}
            className="btn btn-secondary btn-sm"
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button type="button" onClick={openAddModal} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Tagline & Badge</th>
                <th>Products Count</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat) => {
                  const count = products.filter(
                    (p) => p.categoryId === cat.slug || p.categoryId === cat.id || p.category === cat.name
                  ).length;
                  const isActive = cat.is_active !== false;

                  return (
                    <tr key={cat.id || cat.slug}>
                      <td>
                        <div className="admin-product-cell">
                          <img
                            src={cat.image_url || cat.image || '/images/cat_indoor.jpg'}
                            alt={cat.name}
                            className="admin-product-thumb"
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--color-dark-green)' }}>
                              {cat.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {cat.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <code style={{ fontSize: '0.8rem' }}>{cat.slug}</code>
                      </td>

                      <td>
                        <div>
                          <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>
                            {cat.tagline || '—'}
                          </span>
                        </div>
                        {cat.badge && (
                          <span
                            className="badge badge-sage"
                            style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem', marginTop: '0.2rem' }}
                          >
                            {cat.badge}
                          </span>
                        )}
                      </td>

                      <td>
                        <span style={{ fontWeight: 600 }}>{count} plants</span>
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          className={`admin-badge ${isActive ? 'success' : 'neutral'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          {isActive ? (
                            <>
                              <Eye size={13} />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={13} />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Link
                            to={`/shop?category=${cat.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost btn-sm"
                            title="Preview category in store"
                            style={{ padding: '0.35rem' }}
                          >
                            <ExternalLink size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.65rem' }}
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => promptDeleteCategory(cat)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--color-error)', padding: '0.35rem' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Create Botanical Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn btn-ghost btn-sm"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {modalError && (
                  <div className="auth-error-banner" role="alert">
                    <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                    <div>{modalError}</div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="cat-name">
                    Category Name <span className="required">*</span>
                  </label>
                  <input
                    id="cat-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Rare Foliage"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cat-slug">
                    Category Slug <span className="required">*</span>
                  </label>
                  <input
                    id="cat-slug"
                    name="slug"
                    type="text"
                    required
                    value={formData.slug}
                    onChange={handleFormChange}
                    placeholder="e.g. rare-foliage"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cat-desc">
                    Description
                  </label>
                  <textarea
                    id="cat-desc"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Brief description for customer cards..."
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cat-tagline">
                      Tagline
                    </label>
                    <input
                      id="cat-tagline"
                      name="tagline"
                      type="text"
                      value={formData.tagline}
                      onChange={handleFormChange}
                      placeholder="e.g. Architectural Greens"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cat-badge">
                      Merchandising Badge
                    </label>
                    <input
                      id="cat-badge"
                      name="badge"
                      type="text"
                      value={formData.badge}
                      onChange={handleFormChange}
                      placeholder="e.g. Trending, Low Water"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cat-image">
                    Image Asset URL
                  </label>
                  <input
                    id="cat-image"
                    name="image_url"
                    type="text"
                    value={formData.image_url}
                    onChange={handleFormChange}
                    placeholder="/images/cat_indoor.jpg"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input
                    id="cat-active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleFormChange}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)' }}
                  />
                  <label htmlFor="cat-active" style={{ cursor: 'pointer', fontWeight: 600 }}>
                    Active (Visible to customers on shop page)
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Deactivate Category Confirmation */}
      {deleteModalOpen && targetCategory && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '480px' }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-error)' }}>
                <AlertTriangle size={22} />
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Remove Category</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="btn btn-ghost btn-sm"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p style={{ marginBottom: '1rem', color: 'var(--color-primary-text)' }}>
                Are you sure you want to remove <strong>"{targetCategory.name}"</strong>?
              </p>

              {assignedCount > 0 ? (
                <div
                  style={{
                    backgroundColor: '#FEF7E0',
                    border: '1px solid #FEEFC3',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: '#704800',
                    lineHeight: 1.45
                  }}
                >
                  <strong>Notice:</strong> This category is currently assigned to{' '}
                  <strong>{assignedCount} active products</strong>. Permanent deletion would orphan those plants.
                  Clicking confirm will safely <strong>deactivate</strong> the category instead.
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                  This category has no assigned plants and can be safely removed.
                </p>
              )}
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="btn btn-sm"
                style={{ backgroundColor: 'var(--color-error)', color: '#FFF' }}
              >
                {assignedCount > 0 ? 'Deactivate Category' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
