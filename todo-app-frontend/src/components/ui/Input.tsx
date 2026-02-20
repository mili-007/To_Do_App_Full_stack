import { forwardRef, type ChangeEvent } from 'react';
import PasswordInput from './PasswordInput';

const LABEL_CLASS = 'block text-sm font-semibold text-gray-700 mb-2';
const ERROR_CLASS = 'mt-1 text-sm text-red-600';
const INPUT_BASE_CLASS = 'input-field';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'time';

export interface InputProps {
  type?: InputType;
  id?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  step?: number;
  className?: string;
  autoComplete?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = 'text',
    id,
    name,
    value,
    onChange,
    onBlur,
    label,
    error,
    placeholder,
    required,
    disabled,
    minLength,
    maxLength,
    min,
    max,
    step,
    className = '',
    autoComplete,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedby
  },
  ref
) {
  const inputId = id ?? name;
  const hasError = Boolean(error);
  const inputClassName = `${INPUT_BASE_CLASS} ${hasError ? 'border-red-500 focus:ring-red-500' : ''} ${className}`.trim();
  const errorId = error ? `${inputId}-error` : undefined;

  const commonProps = {
    id: inputId,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    required,
    'aria-invalid': ariaInvalid ?? hasError,
    'aria-describedby': ariaDescribedby ?? errorId
  };

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className={LABEL_CLASS}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {type === 'password' ? (
        <PasswordInput
          {...commonProps}
          ref={ref}
          minLength={minLength}
          className={hasError ? 'border-red-500 focus:ring-red-500' : ''}
        />
      ) : (
        <input
          ref={ref}
          type={type}
          {...commonProps}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          className={inputClassName}
        />
      )}
      {error && (
        <p id={errorId} className={ERROR_CLASS} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
