// src/components/auth/AdminRoute.jsx
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminRoute({ children }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8FAF7',
          gap: '1rem'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            border: '3px solid var(--color-soft-sage)',
            borderTopColor: 'var(--color-primary-green)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        <p style={{ color: 'var(--color-primary-green)', fontWeight: 600, fontSize: '0.95rem' }}>
          Verifying Administrator Clearance...
        </p>
      </div>
    );
  }

  // 1. Not logged in -> redirect to /admin/login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 2. Logged in, but NOT an admin -> Access Denied Screen (403)
  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF8F0',
          padding: '2rem 1.25rem'
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FDF3F2',
              color: 'var(--color-error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <ShieldAlert size={34} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: '#FDF3F2',
              color: 'var(--color-error)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.85rem'
            }}
          >
            <Lock size={13} />
            <span>403 Access Denied</span>
          </div>

          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
            Administrator Privileges Required
          </h2>

          <p style={{ fontSize: '0.925rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            You are logged in as <strong>{user.email}</strong>, which holds a standard Customer role.
            This area is strictly restricted to authenticated store administrators with verified database authorization.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/" className="btn btn-primary btn-block">
              <ArrowLeft size={16} />
              <span>Return to Public Website</span>
            </Link>

            <button
              type="button"
              onClick={async () => {
                await signOut();
                window.location.href = '/admin/login';
              }}
              className="btn btn-outline btn-block"
            >
              <LogOut size={16} />
              <span>Switch / Sign In as Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin -> render children
  return children;
}
