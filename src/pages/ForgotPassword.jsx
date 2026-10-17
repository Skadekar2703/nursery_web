// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(result.error || 'Failed to send reset link. Please check your email.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Logo size="md" />
          </div>
          <div className="auth-badge">Security & Access</div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            Enter the email address registered with your Nursury account and we will send you secure recovery instructions.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {submitted ? (
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
              Check Your Inbox
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#1D2B22', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              We have dispatched recovery instructions to <strong>{email}</strong>. Follow the link inside the email to set a new password.
            </p>
            <Link to="/login" className="btn btn-outline btn-sm btn-block">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="reset-email">
                Email Address <span className="required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="input-icon-left" />
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="name@example.com"
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? (
                <span>Sending link...</span>
              ) : (
                <>
                  <span>Send Recovery Instructions</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer" style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
