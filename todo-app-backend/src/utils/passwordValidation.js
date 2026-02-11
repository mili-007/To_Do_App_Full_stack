/**
 * Strong password validation for signup.
 * Returns { valid: boolean, message: string }.
 */
const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

const RULES = {
  minLength: { test: (p) => p.length >= MIN_LENGTH, message: `At least ${MIN_LENGTH} characters` },
  maxLength: { test: (p) => p.length <= MAX_LENGTH, message: `No more than ${MAX_LENGTH} characters` },
  uppercase: { test: (p) => /[A-Z]/.test(p), message: 'At least one uppercase letter' },
  lowercase: { test: (p) => /[a-z]/.test(p), message: 'At least one lowercase letter' },
  number: { test: (p) => /\d/.test(p), message: 'At least one number' },
  special: { test: (p) => /[!@#$%^&*()_+\-=[\]{}|;':",./<>?\\`~]/.test(p), message: 'At least one special character (!@#$%^&* etc.)' },
};

/**
 * Validate password strength for registration.
 * @param {string} password - Plain password
 * @returns {{ valid: boolean, message: string }}
 */
function validatePasswordStrength(password) {
  if (typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  const trimmed = password.trim();
  if (!trimmed.length) {
    return { valid: false, message: 'Password is required' };
  }
  for (const key of Object.keys(RULES)) {
    const { test, message } = RULES[key];
    if (!test(trimmed)) {
      return { valid: false, message };
    }
  }
  return { valid: true, message: '' };
}

/**
 * Basic validation for login: non-empty and reasonable length (avoid empty or huge strings).
 * @param {string} password - Plain password
 * @returns {{ valid: boolean, message: string }}
 */
function validatePasswordForLogin(password) {
  if (typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  if (!password.trim().length) {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length > MAX_LENGTH) {
    return { valid: false, message: 'Invalid credentials' };
  }
  return { valid: true, message: '' };
}

module.exports = {
  validatePasswordStrength,
  validatePasswordForLogin,
  PASSWORD_RULES: Object.values(RULES).map((r) => r.message),
  MIN_LENGTH,
  MAX_LENGTH,
};
