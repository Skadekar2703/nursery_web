// src/components/common/Logo.jsx
import { Link } from 'react-router-dom';

export function Logo({
  showTagline = false,
  variant = 'default',
  size = 'md',
  className = ''
}) {
  const isWhite = variant === 'white';
  const isCompact = variant === 'compact';

  const scaleMap = {
    sm: 0.75,
    md: 1,
    lg: 1.25
  };

  const scale = scaleMap[size] || 1;

  return (
    <Link
      to="/"
      className={`nursury-logo-link ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${10 * scale}px`,
        textDecoration: 'none'
      }}
      aria-label="Nursury Home"
    >
      <div
        className="logo-emblem"
        style={{
          width: `${38 * scale}px`,
          height: `${38 * scale}px`,
          flexShrink: 0
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="leafGradLeft" x1="14" y1="38" x2="8" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#185C3A" />
              <stop offset="100%" stopColor="#3E9B57" />
            </linearGradient>
            <linearGradient id="leafGradRight" x1="24" y1="34" x2="40" y2="14" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#103D29" />
              <stop offset="100%" stopColor="#25834A" />
            </linearGradient>
          </defs>
          <rect
            width="48"
            height="48"
            rx="14"
            fill={isWhite ? 'rgba(255, 255, 255, 0.15)' : '#E5EFE3'}
          />
          <path
            d="M24 42 C24 30, 23 18, 14 9 C25 8, 32 18, 25 32"
            fill="url(#leafGradLeft)"
          />
          <path
            d="M24 33 C29 26, 36 21, 42 16 C41 27, 34 34, 25 36"
            fill="url(#leafGradRight)"
          />
          <path
            d="M24 42 C24 29, 23 20, 17 12"
            stroke={isWhite ? '#FFFFFF' : '#FAF8F0'}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M24.5 33 C29 27, 34 23, 38 18"
            stroke={isWhite ? '#FFFFFF' : '#FAF8F0'}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="24" cy="42" r="2" fill="#185C3A" />
        </svg>
      </div>

      {!isCompact && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: `${1.45 * scale}rem`,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: isWhite ? '#FFFFFF' : 'var(--color-primary-green)'
            }}
          >
            Nursury
          </span>
          {showTagline && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: `${0.65 * scale}rem`,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: isWhite ? '#E2ECE5' : 'var(--color-secondary-text)',
                marginTop: '1px'
              }}
            >
              Bringing Green Life Home
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
