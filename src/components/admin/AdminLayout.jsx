// src/components/admin/AdminLayout.jsx
import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  FolderTree,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';

export function AdminLayout() {
  const { user, profile, signOut, configured } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Plants & Products', icon: Sprout },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/settings', label: 'System & Supabase', icon: Settings }
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo size="sm" />
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(false)}
              style={{ color: '#FFFFFF' }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <div
            style={{
              marginTop: '0.65rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#A3B899'
            }}
          >
            <ShieldCheck size={13} color="var(--color-accent-green)" />
            <span>Store Command Center</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {(profile?.full_name || user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-details">
              <div className="admin-user-name">
                {profile?.full_name || profile?.displayName || 'Administrator'}
              </div>
              <div className="admin-user-role">Super Admin</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#CBD5C8',
              fontSize: '0.825rem',
              fontWeight: 600
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-content-area">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-secondary-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>Nursury Admin</span>
              <span style={{ opacity: 0.4 }}>/</span>
              <span style={{ color: 'var(--color-dark-green)' }}>Management</span>
            </span>
          </div>

          <div className="admin-topbar-right">
            {/* Supabase Status Pill */}
            {configured ? (
              <span className="admin-status-pill live" title="Connected to PostgreSQL via Supabase Auth & RLS">
                <span className="status-dot" />
                <span>Supabase Live DB</span>
              </span>
            ) : (
              <Link to="/admin/settings" className="admin-status-pill demo" title="Click to view Supabase connection setup">
                <span className="status-dot" />
                <span>Local Demo Mode</span>
              </Link>
            )}

            {/* Back to Public Store */}
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <Store size={15} />
              <span>View Store</span>
              <ExternalLink size={13} style={{ opacity: 0.6 }} />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
