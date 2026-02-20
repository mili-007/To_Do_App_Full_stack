import type { ButtonHTMLAttributes, ReactNode } from 'react';

const SPINNER = (
  <svg
    className="animate-spin -ml-1 mr-2 h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const BASE =
  'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-indigo-500 disabled:transform-none',
  primaryLift:
    'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-indigo-500 disabled:transform-none',
  success:
    'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  secondary:
    'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
  danger:
    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  ghost:
    'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 focus:ring-indigo-400',
  ghostDanger:
    'text-red-600 hover:text-red-800 hover:bg-red-50 focus:ring-red-400',
} as const;

const SIZES = {
  default: 'py-3 px-4',
  sm: 'py-2 px-4 text-sm font-medium',
  icon: 'p-2',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
}

const Button = ({
  type = 'button',
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  loading = false,
  loadingLabel,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled ?? loading;
  const variantClass = VARIANTS[variant];
  const sizeClass = SIZES[size];
  const widthClass = fullWidth ? 'w-full' : '';
  const spinnerIsLight = variant === 'primary' || variant === 'primaryLift' || variant === 'success' || variant === 'danger';
  const spinnerClass = spinnerIsLight ? 'text-white' : 'text-gray-600';

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${BASE} ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      {...rest}
    >
      {loading ? (
        <>
          <span className={spinnerClass}>{SPINNER}</span>
          {loadingLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
