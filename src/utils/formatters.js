// src/utils/formatters.js

/**
 * Formats a number as Indian Rupee (INR) currency
 * @param {number} amount
 * @returns {string} e.g. "₹699" or "₹1,249"
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.round(amount));
}

/**
 * Formats date into readable string e.g. "16 Oct 2026, 7:45 PM"
 * @param {string|Date} dateVal
 * @returns {string}
 */
export function formatDate(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Validates a 10-digit Indian mobile number
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidIndianPhone(phone) {
  if (!phone) return false;
  const clean = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(clean);
}

/**
 * Validates a 6-digit Indian PIN code
 * @param {string} pin
 * @returns {boolean}
 */
export function isValidPincode(pin) {
  if (!pin) return false;
  const clean = pin.trim();
  return /^[1-9][0-9]{5}$/.test(clean);
}
