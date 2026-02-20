import { forwardRef, useState, type ChangeEvent } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  {
    id,
    name,
    value,
    onChange,
    onBlur,
    placeholder = 'Enter password',
    required,
    minLength,
    className = '',
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedby
  },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className={`input-field pr-10 ${className}`.trim()}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg focus:outline-none"
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? (
          <HiOutlineEyeOff className="w-5 h-5 text-indigo-600" aria-hidden />
        ) : (
          <HiOutlineEye className="w-5 h-5 text-indigo-600" aria-hidden />
        )}
      </button>
    </div>
  );
});

export default PasswordInput;
