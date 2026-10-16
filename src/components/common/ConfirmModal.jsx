// src/components/common/ConfirmModal.jsx
import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onClose
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(16, 61, 41, 0.45)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 150ms ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          maxWidth: '420px',
          width: '100%',
          padding: '1.75rem',
          position: 'relative',
          animation: 'slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          border: '1px solid var(--color-border)'
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-secondary-text)'
          }}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: confirmVariant === 'danger' ? '#FEECEB' : 'var(--color-soft-sage)',
              color: confirmVariant === 'danger' ? 'var(--color-error)' : 'var(--color-primary-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={20} />
          </div>

          <div style={{ flex: 1 }}>
            <h4
              id="modal-title"
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--color-dark-green)',
                marginBottom: '0.4rem'
              }}
            >
              {title}
            </h4>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-secondary-text)',
                lineHeight: 1.5,
                marginBottom: '1.5rem'
              }}
            >
              {message}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary btn-sm"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="btn btn-sm btn-primary"
                style={confirmVariant === 'danger' ? { backgroundColor: 'var(--color-error)' } : {}}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
