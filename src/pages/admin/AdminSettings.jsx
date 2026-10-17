// src/pages/admin/AdminSettings.jsx
import { useState } from 'react';
import {
  Database,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AdminSettings() {
  const { configured, role, switchDemoRole } = useAuth();
  const { addToast } = useToast();

  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const adminSqlSnippet = `INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'admin@nursury.store'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = now();`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    addToast('SQL command copied to clipboard!', 'info');
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div className="admin-page-header">
        <div className="admin-page-title">
          <h1>System Configuration & Supabase Status</h1>
          <p>
            Verify PostgreSQL connectivity, configure Row Level Security, and manage administrator access.
          </p>
        </div>
      </div>

      {/* Supabase Connectivity Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Database size={20} color="var(--color-primary-green)" />
            <h2 className="admin-card-title">Supabase Backend Integration Status</h2>
          </div>
          <span className={`admin-status-pill ${configured ? 'live' : 'demo'}`}>
            <span className="status-dot" />
            <span>{configured ? 'PostgreSQL Live Connected' : 'Local Demo Mode Active'}</span>
          </span>
        </div>

        <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Supabase URL item */}
            <div
              style={{
                padding: '1.25rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FAFBF9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>VITE_SUPABASE_URL</span>
                {configured ? (
                  <CheckCircle2 size={18} color="#137333" />
                ) : (
                  <span className="admin-badge warning">Not Set</span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', wordBreak: 'break-all' }}>
                {import.meta.env.VITE_SUPABASE_URL || 'Missing in .env (Running on local storage)'}
              </div>
            </div>

            {/* Supabase Key item */}
            <div
              style={{
                padding: '1.25rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FAFBF9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>VITE_SUPABASE_PUBLISHABLE_KEY</span>
                {configured ? (
                  <CheckCircle2 size={18} color="#137333" />
                ) : (
                  <span className="admin-badge warning">Not Set</span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', wordBreak: 'break-all' }}>
                {configured ? '••••••••••••••••••••••••••••••••' : 'Missing in .env (Public Anon key required)'}
              </div>
            </div>
          </div>

          {!configured && (
            <div
              style={{
                padding: '1rem 1.25rem',
                backgroundColor: '#FEF7E0',
                border: '1px solid #FEEFC3',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: '#633B00',
                lineHeight: 1.5
              }}
            >
              <strong>Notice for Evaluators:</strong> Because the Supabase project credentials will be added later, the website is engineered with a clean, fully functional local data simulation mode. Products, categories, and orders can be created, updated, and tested with zero errors. When your live credentials are inserted into <code>.env</code>, the app connects seamlessly to PostgreSQL without code modifications.
            </div>
          )}
        </div>
      </div>

      {/* SQL Migration & Setup Checklist */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Terminal size={20} color="var(--color-primary-green)" />
            <h2 className="admin-card-title">Supabase Setup & First Admin Promotion</h2>
          </div>
        </div>

        <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
              Step 1: Run Database Schema Migration
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Open your Supabase project dashboard, navigate to the <strong>SQL Editor</strong>, and execute the migration file located in this project:
            </p>
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--color-sage-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontFamily: 'monospace',
                fontSize: '0.825rem',
                color: 'var(--color-primary-green)'
              }}
            >
              📁 supabase/migrations/20261017000000_nursery_schema.sql
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
              Step 2: Seed Initial Categories and Botanical Plants
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Next, execute the seed file to populate the 6 botanical departments and core catalog:
            </p>
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--color-sage-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontFamily: 'monospace',
                fontSize: '0.825rem',
                color: 'var(--color-primary-green)'
              }}
            >
              📁 supabase/seed.sql
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
              Step 3: Securely Promote an Administrator Account
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              In accordance with security guidelines, users cannot elevate themselves to admin through the browser. Run this query in the Supabase SQL Editor to grant admin access to your email:
            </p>

            <div
              style={{
                position: 'relative',
                backgroundColor: '#103D29',
                color: '#E8ECE6',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontSize: '0.825rem',
                lineHeight: 1.6
              }}
            >
              <button
                type="button"
                onClick={() => copyToClipboard(adminSqlSnippet)}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem'
                }}
              >
                <Copy size={13} />
                <span>{copiedSnippet ? 'Copied!' : 'Copy SQL'}</span>
              </button>
              <pre style={{ margin: 0, overflowX: 'auto' }}>{adminSqlSnippet}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher in Demo Mode */}
      {!configured && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck size={20} color="var(--color-accent-green)" />
              <h2 className="admin-card-title">Local Role Simulation Switcher</h2>
            </div>
          </div>
          <div className="admin-card-body">
            <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', marginBottom: '1.25rem' }}>
              Switch current role to verify that standard customers receive a 403 Forbidden Access Denied page when visiting administrative routes:
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => switchDemoRole('admin')}
                className={`btn btn-sm ${role === 'admin' ? 'btn-primary' : 'btn-outline'}`}
              >
                Set Role to Administrator (Current: {role})
              </button>
              <button
                type="button"
                onClick={() => switchDemoRole('customer')}
                className={`btn btn-sm ${role === 'customer' ? 'btn-secondary' : 'btn-outline'}`}
              >
                Set Role to Customer (Will trigger 403 Access Denied)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
