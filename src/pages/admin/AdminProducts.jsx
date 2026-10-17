import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  X
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { formatINR } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export function AdminProducts() {
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive' | 'low-stock'
  const [sortBy, setSortBy] = useState('newest');

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState(null);
  const [deleteProcessing, setDeleteProcessing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({ activeOnly: false }),
        categoryService.getCategories({ activeOnly: false })
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      addToast('Failed to load botanical catalog', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      productService.getProducts({ activeOnly: false }),
      categoryService.getCategories({ activeOnly: false })
    ])
      .then(([prodRes, catRes]) => {
        if (mounted) {
          setProducts(prodRes.data || []);
          setCategories(catRes.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error('Failed to load products:', err);
          addToast('Failed to load botanical catalog', 'error');
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

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.categoryId === selectedCategory || p.category === selectedCategory
      );
    }

    // Status Filter
    if (statusFilter === 'active') {
      result = result.filter((p) => p.is_active !== false);
    } else if (statusFilter === 'inactive') {
      result = result.filter((p) => p.is_active === false);
    } else if (statusFilter === 'low-stock') {
      result = result.filter((p) => (p.stockQuantity || p.stock_quantity || 0) <= 5);
    }

    // Sort
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock-asc') {
      result.sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0));
    } else {
      // Newest
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, statusFilter, sortBy]);

  // Quick toggle active
  const handleToggleActive = async (product) => {
    const nextState = product.is_active === false ? true : false;
    const res = await productService.updateProduct(product.id, {
      is_active: nextState,
      isActive: nextState
    });

    if (res.data) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: nextState, isActive: nextState } : p))
      );
      addToast(
        `"${product.name}" is now ${nextState ? 'Active on store' : 'Deactivated'}`,
        'success'
      );
    } else {
      addToast(res.error || 'Failed to update product status', 'error');
    }
  };

  // Open delete dialog
  const promptDelete = (product) => {
    setTargetProduct(product);
    setDeleteModalOpen(true);
  };

  // Execute deletion (or deactivation)
  const confirmDelete = async (softDelete = true) => {
    if (!targetProduct) return;
    setDeleteProcessing(true);

    const res = await productService.deleteProduct(targetProduct.id, softDelete);
    setDeleteProcessing(false);
    setDeleteModalOpen(false);

    if (res.success || res.data) {
      if (softDelete) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === targetProduct.id ? { ...p, is_active: false, isActive: false } : p
          )
        );
        addToast(`"${targetProduct.name}" deactivated safely to protect order history`, 'info');
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== targetProduct.id));
        addToast(`"${targetProduct.name}" permanently deleted`, 'info');
      }
    } else {
      addToast(res.error || 'Failed to remove product', 'error');
    }
    setTargetProduct(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <h1>Plants & Products Management</h1>
          <p>
            Add, update pricing, curate plant care details, manage stock levels, and control catalog visibility.
          </p>
        </div>

        <div className="admin-actions">
          <button
            type="button"
            onClick={handleRefresh}
            className="btn btn-secondary btn-sm"
            disabled={loading}
            title="Refresh product list"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <Link to="/admin/products/add" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add New Plant</span>
          </Link>
        </div>
      </div>

      {/* Product List Card */}
      <div className="admin-card">
        {/* Filters and Search Bar */}
        <div className="admin-filters-bar">
          <div className="admin-search-box">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by plant name, slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '160px', height: '38px', fontSize: '0.85rem' }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.slug || c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '140px', height: '38px', fontSize: '0.85rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="low-stock">Low Stock (≤ 5)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px', height: '38px', fontSize: '0.85rem' }}
          >
            <option value="newest">Sort: Newest</option>
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="price-asc">Sort: Price (Low to High)</option>
            <option value="price-desc">Sort: Price (High to Low)</option>
            <option value="stock-asc">Sort: Lowest Stock</option>
          </select>

          {/* Clear Filters */}
          {(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStatusFilter('all');
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              <X size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Plant</th>
                <th>Category</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
                      <RefreshCw size={18} className="spin" color="var(--color-primary-green)" />
                      <span>Loading botanical catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => {
                  const stock = prod.stockQuantity !== undefined ? prod.stockQuantity : (prod.stock_quantity || 0);
                  const isActive = prod.is_active !== false;

                  return (
                    <tr key={prod.id}>
                      {/* Product Name & Thumb */}
                      <td>
                        <div className="admin-product-cell">
                          <img
                            src={prod.image || prod.imageUrl || '/images/onboarding_plant.jpg'}
                            alt={prod.name}
                            className="admin-product-thumb"
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--color-dark-green)' }}>
                              {prod.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                              Slug: <code>{prod.slug}</code>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          {prod.category || 'Uncategorized'}
                        </span>
                      </td>

                      {/* Price */}
                      <td>
                        <div style={{ fontWeight: 700 }}>{formatINR(prod.price)}</div>
                        {prod.originalPrice && (
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--color-secondary-text)',
                              textDecoration: 'line-through'
                            }}
                          >
                            {formatINR(prod.originalPrice)}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            className={`admin-badge ${
                              stock === 0 ? 'danger' : stock <= 5 ? 'warning' : 'success'
                            }`}
                          >
                            {stock === 0 ? 'Out of Stock' : `${stock} units`}
                          </span>
                        </div>
                      </td>

                      {/* Active Status */}
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(prod)}
                          title={isActive ? 'Click to deactivate' : 'Click to activate'}
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

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          {/* View in store */}
                          <Link
                            to={`/product/${prod.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost btn-sm"
                            title="Preview on live store"
                            style={{ padding: '0.35rem' }}
                          >
                            <ExternalLink size={16} />
                          </Link>

                          {/* Edit */}
                          <Link
                            to={`/admin/products/edit/${prod.id}`}
                            className="btn btn-secondary btn-sm"
                            title="Edit plant product"
                            style={{ padding: '0.35rem 0.65rem' }}
                          >
                            <Edit size={15} />
                            <span>Edit</span>
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => promptDelete(prod)}
                            className="btn btn-ghost btn-sm"
                            title="Remove or deactivate"
                            style={{ color: 'var(--color-error)', padding: '0.35rem' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem' }}>
                    <div style={{ color: 'var(--color-secondary-text)', marginBottom: '1rem' }}>
                      No plant products match your search or filter criteria.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setStatusFilter('all');
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deletion / Deactivation Modal */}
      {deleteModalOpen && targetProduct && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '480px' }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-error)' }}>
                <AlertTriangle size={22} />
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Remove Plant Product</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="btn btn-ghost btn-sm"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p style={{ marginBottom: '1rem', color: 'var(--color-primary-text)' }}>
                Are you sure you want to remove <strong>"{targetProduct.name}"</strong>?
              </p>

              <div
                style={{
                  backgroundColor: '#FEF7E0',
                  border: '1px solid #FEEFC3',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  color: '#704800',
                  lineHeight: 1.45,
                  marginBottom: '1.25rem'
                }}
              >
                <strong>Recommended:</strong> Soft-deactivation hides this plant from customer shopping pages
                while preserving order invoices and historical customer purchase records.
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                disabled={deleteProcessing}
                onClick={() => setDeleteModalOpen(false)}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteProcessing}
                onClick={() => confirmDelete(true)}
                className="btn btn-secondary btn-sm"
              >
                Deactivate (Safe)
              </button>

              <button
                type="button"
                disabled={deleteProcessing}
                onClick={() => confirmDelete(false)}
                className="btn btn-sm"
                style={{ backgroundColor: 'var(--color-error)', color: '#FFF' }}
              >
                {deleteProcessing ? 'Removing...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
