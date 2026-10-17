// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';

export function Login() {
  const { signIn, configured, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/profile';

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
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!formData.password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await signIn({
      email: formData.email.trim(),
      password: formData.password
    });
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleDemoCustomer = () => {
    switchDemoRole('customer');
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Logo size="md" />
          </div>
          <div className="auth-badge">Customer Portal</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to track plant orders, manage care wishlist, and access exclusive botanical member guides.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="customer-email">
              Email Address <span className="required">*</span>
            </label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="input-icon-left" />
              <input
                id="customer-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`form-input ${errorMsg ? 'is-error' : ''}`}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer-password">
              Password <span className="required">*</span>
            </label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="input-icon-left" />
              <input
                id="customer-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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

          <div className="auth-extra-links">
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Nursury</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {!configured && (
          <div className="auth-demo-helper">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <Sparkles size={15} color="var(--color-primary-green)" />
              <span>Local Demo Mode Active</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
              Supabase credentials not yet configured. You can test customer login with one click:
            </p>
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="btn btn-outline btn-sm btn-block"
              style={{ marginTop: '0.65rem' }}
            >
              Sign In as Demo Customer (Aarav)
            </button>
          </div>
        )}

        <div className="auth-footer">
          Don't have an account yet?{' '}
          <Link to="/signup" className="auth-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
