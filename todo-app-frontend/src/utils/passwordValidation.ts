/**
 * Strong password validation for signup (must match backend rules).
 */
const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

export const PASSWORD_REQUIREMENTS = [
  `At least ${MIN_LENGTH} characters`,
  'At least one uppercase letter',
  'At least one lowercase letter',
  'At least one number',
  'At least one special character (!@#$%^&* etc.)',
] as const;

const RULES: Array<{ test: (p: string) => boolean; message: string }> = [
  { test: (p) => p.length >= MIN_LENGTH, message: `At least ${MIN_LENGTH} characters` },
  { test: (p) => p.length <= MAX_LENGTH, message: `No more than ${MAX_LENGTH} characters` },
  { test: (p) => /[A-Z]/.test(p), message: 'At least one uppercase letter' },
  { test: (p) => /[a-z]/.test(p), message: 'At least one lowercase letter' },
  { test: (p) => /\d/.test(p), message: 'At least one number' },
  { test: (p) => /[!@#$%^&*()_+\-=[\]{}|;':",./<>?\\`~]/.test(p), message: 'At least one special character (!@#$%^&* etc.)' },
];

export interface PasswordValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Validate password strength for registration (signup).
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  if (typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  const trimmed = password.trim();
  if (!trimmed.length) {
    return { valid: false, message: 'Password is required' };
  }
  for (const { test, message } of RULES) {
    if (!test(trimmed)) {
      return { valid: false, message };
    }
  }
  return { valid: true, message: '' };
}

/**
 * Basic validation for login: non-empty.
 */
export function validatePasswordForLogin(password: string): PasswordValidationResult {
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
