// src/pages/SignUp.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';

export function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessInfo('');

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    const result = await signUp({
      fullName: fullName.trim(),
      email: email.trim(),
      password
    });
    setLoading(false);

    if (result.success) {
      if (result.session) {
        navigate('/profile', { replace: true });
      } else {
        setSuccessInfo(
          'Registration complete! If email confirmation is enabled in your Supabase project, check your inbox to confirm your account before signing in.'
        );
      }
    } else {
      setErrorMsg(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Logo size="md" />
          </div>
          <div className="auth-badge">Join Nursury</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Cultivate your botanical sanctuary. Track orders, get personalised plant care reminders, and access member perks.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {successInfo ? (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#E6F4EA',
              border: '1px solid #CEEAD6',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              animation: 'fadeIn 300ms ease-out'
            }}
          >
            <CheckCircle2 size={36} color="#137333" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#137333', marginBottom: '0.5rem' }}>
              Account Created!
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#1D2B22', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {successInfo}
            </p>
            <Link to="/login" className="btn btn-primary btn-sm btn-block">
              Proceed to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="customer-name">
                Full Name <span className="required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <User size={18} className="input-icon-left" />
                <input
                  id="customer-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="customer-signup-email">
                Email Address <span className="required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="input-icon-left" />
                <input
                  id="customer-signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="customer-signup-password">
                Password <span className="required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="input-icon-left" />
                <input
                  id="customer-signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="form-input"
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

            <div className="form-group">
              <label className="form-label" htmlFor="customer-confirm-password">
                Confirm Password <span className="required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="input-icon-left" />
                <input
                  id="customer-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="form-input"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Nursury Account</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
