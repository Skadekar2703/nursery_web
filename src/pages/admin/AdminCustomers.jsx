import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, RefreshCw, Mail } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export function AdminCustomers() {
  const { addToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCustomers = useCallback(async () => {
    try {
      const res = await adminService.getCustomers();
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
      addToast('Failed to load customers list', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    let mounted = true;
    adminService
      .getCustomers()
      .then((res) => {
        if (mounted) {
          setCustomers(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error('Failed to load customers:', err);
          addToast('Failed to load customers list', 'error');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [addToast]);

  const handleRefresh = async () => {
    setLoading(true);
    await loadCustomers();
  };

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.trim().toLowerCase();
    return customers.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title">
          <h1>Registered Customers & Accounts</h1>
          <p>View customer profiles registered in Supabase Auth, order frequencies, and account records.</p>
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
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-filters-bar">
          <div className="admin-search-box">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by customer name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Joined Date</th>
                <th>Orders</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading customers...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-soft-sage)',
                            color: 'var(--color-primary-green)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                          }}
                        >
                          {(c.full_name || c.email || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.full_name || 'Plant Parent'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                            ID: <code>{c.id?.substring(0, 8)}...</code>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={14} color="var(--color-secondary-text)" />
                        <span>{c.email}</span>
                      </div>
                    </td>

                    <td>
                      <span style={{ color: c.phone ? 'inherit' : 'var(--color-secondary-text)' }}>
                        {c.phone || '—'}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.85rem' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Active Member'}
                    </td>

                    <td>
                      <span className="badge badge-sage" style={{ fontWeight: 600 }}>
                        {c.order_count || 1} Order{(c.order_count || 1) !== 1 ? 's' : ''}
                      </span>
                    </td>

                    <td>
                      <span className="admin-badge success">Customer</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    No customer profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
