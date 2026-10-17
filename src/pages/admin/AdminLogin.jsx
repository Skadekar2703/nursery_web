// src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, AlertTriangle, Sparkles, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';

export function AdminLogin() {
  const { signInAdmin, configured, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid administrator email.');
      return;
    }

    if (!formData.password) {
      setErrorMsg('Please enter your administrator password.');
      return;
    }

    setLoading(true);
    const result = await signInAdmin({
      email: formData.email.trim(),
      password: formData.password
    });
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(
        result.error ||
          'Authentication failed. Ensure you have valid credentials and verified Administrator status in the database.'
      );
    }
  };

  const handleDemoAdmin = () => {
    switchDemoRole('admin');
    navigate(from, { replace: true });
  };

  return (
    <div
      className="auth-page"
      style={{
        background: 'linear-gradient(135deg, #103D29 0%, #0A2418 100%)',
        minHeight: '100vh',
        padding: '3rem 1.25rem'
      }}
    >
      <div
        className="auth-card"
        style={{
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Logo size="md" />
          </div>
          <div className="auth-badge admin">
            <ShieldCheck size={14} />
            <span>Restricted Access • Admin Portal</span>
          </div>
          <h1 className="auth-title" style={{ color: 'var(--color-dark-green)' }}>
            Staff Administration
          </h1>
          <p className="auth-subtitle">
            Secure administrative console for catalog curation, live inventory adjustments, and order fulfillment.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner" role="alert">
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">
              Admin Email <span className="required">*</span>
            </label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="input-icon-left" />
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@nursury.store"
                className={`form-input ${errorMsg ? 'is-error' : ''}`}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              Password <span className="required">*</span>
            </label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="input-icon-left" />
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                className={`form-input ${errorMsg ? 'is-error' : ''}`}
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{
              marginTop: '0.75rem',
              backgroundColor: 'var(--color-dark-green)',
              borderColor: 'var(--color-dark-green)'
            }}
          >
            {loading ? (
              <span>Verifying Privileges...</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Enter Admin Console</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {!configured && (
          <div
            className="auth-demo-helper"
            style={{
              backgroundColor: '#F3F7F2',
              border: '1px dashed var(--color-primary-green)',
              marginTop: '1.5rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 600,
                color: 'var(--color-dark-green)',
                marginBottom: '0.35rem'
              }}
            >
              <Sparkles size={16} color="var(--color-primary-green)" />
              <span>Simulated Admin Access (Local Demo Mode)</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-secondary-text)', lineHeight: 1.4 }}>
              Supabase credentials not yet provided in <code>.env</code>. Click below to test all admin pages and CRUD workflows immediately:
            </p>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="btn btn-secondary btn-sm btn-block"
              style={{ marginTop: '0.75rem', fontWeight: 600 }}
            >
              Sign In as Demo Admin
            </button>
          </div>
        )}

        <div
          className="auth-footer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.825rem'
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-secondary-text)'
            }}
          >
            <Store size={15} />
            <span>Return to Public Store</span>
          </Link>
          <Link to="/login" className="auth-link">
            Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
}
