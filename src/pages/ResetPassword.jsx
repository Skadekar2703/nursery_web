// src/pages/ResetPassword.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';

export function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } else {
      setErrorMsg(result.error || 'Failed to update password. Your recovery link may have expired.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Logo size="md" />
          </div>
          <div className="auth-badge">Set New Password</div>
          <h1 className="auth-title">Create New Password</h1>
          <p className="auth-subtitle">
            Choose a strong, unique password to secure your Nursury botanical shopping account.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {success ? (
          <div
            style={{
              padding: '1.75rem',
              backgroundColor: '#E6F4EA',
              border: '1px solid #CEEAD6',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              animation: 'fadeIn 300ms ease-out'
            }}
          >
            <CheckCircle2 size={40} color="#137333" style={{ margin: '0 auto 0.85rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#137333', marginBottom: '0.4rem' }}>
              Password Updated!
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#1D2B22', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Your password has been changed successfully. Redirecting you to sign in...
            </p>
            <Link to="/login" className="btn btn-primary btn-sm btn-block">
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="new-password">
                New Password <span className="required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="input-icon-left" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
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
              <label className="form-label" htmlFor="confirm-new-password">
                Confirm New Password <span className="required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="input-icon-left" />
                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Re-enter new password"
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
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login" className="auth-link">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
