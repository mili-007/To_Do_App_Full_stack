const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

export const PASSWORD_REQUIREMENTS = [
  `At least ${MIN_LENGTH} characters`,
  'At least one uppercase letter',
  'At least one lowercase letter',
  'At least one number',
  'At least one special character (!@#$%^&* etc.)',
] as const;

export const PASSWORD_RULE_CHECKS: ReadonlyArray<{ label: string; test: (p: string) => boolean }> = [
  { label: `At least ${MIN_LENGTH} characters`, test: (p) => p.length >= MIN_LENGTH },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /\d/.test(p) },
  { label: 'One special character (!@#$%^&* etc.)', test: (p) => /[!@#$%^&*()_+\-=[\]{}|;':",./<>?\\`~]/.test(p) },
];

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
