import { useEffect, useRef, useState } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
}

type BaseDropdownProps = {
  id: string;
  options: DropdownOption[];
  placeholder?: string;
  onBlur?: () => void;
  'aria-label'?: string;
  disabled?: boolean;
};

export type DropdownProps = (BaseDropdownProps & {
  multiSelect?: false;
  value: string | null;
  onChange: (value: string | null) => void;
}) | (BaseDropdownProps & {
  multiSelect: true;
  value: string[];
  onChange: (value: string[]) => void;
});

export default function Dropdown(props: DropdownProps) {
  const {
    id,
    options,
    placeholder = 'Select...',
    onBlur,
    'aria-label': ariaLabel,
    disabled = false,
    multiSelect = false
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHoveredIndex(null);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  const isMulti = multiSelect === true;
  const value = props.value;
  const onChange = props.onChange;

  const singleValue = value as string | null;
  const displayText = isMulti
    ? (value as string[]).length > 0
      ? (value as string[])
          .map((v) => options.find((o) => o.value === v)?.label)
          .filter(Boolean)
          .join(', ')
      : placeholder
    : singleValue != null && singleValue !== ''
      ? options.find((o) => o.value === singleValue)?.label ?? placeholder
      : placeholder;

  const isOptionSelected = (opt: DropdownOption) =>
    isMulti
      ? (value as string[]).includes(opt.value)
      : (opt.value === '' ? (singleValue == null || singleValue === '') : (singleValue === opt.value));

  const handleSelect = (opt: DropdownOption) => {
    if (isMulti) {
      const current = value as string[];
      const next = current.includes(opt.value)
        ? current.filter((v) => v !== opt.value)
        : [...current, opt.value];
      (onChange as (v: string[]) => void)(next);
    } else {
      (onChange as (v: string | null) => void)(opt.value);
      setIsOpen(false);
    }
  };

  const isEmpty = isMulti ? (value as string[]).length === 0 : (value as string | null) == null || (value as string) === '';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        onBlur={onBlur}
        disabled={disabled}
        className="input-field w-full text-left flex items-center justify-between gap-2 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className={isEmpty ? 'text-gray-500' : ''}>{displayText}</span>
        <span className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white py-1 shadow-lg max-h-60 overflow-auto"
          role="listbox"
          aria-multiselectable={isMulti}
        >
          {options.map((opt, index) => {
            const selected = isOptionSelected(opt);
            const isHovered = hoveredIndex === index;
            const showHighlight = selected || isHovered;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(opt);
                  }
                }}
                tabIndex={0}
                className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                  showHighlight ? 'bg-indigo-600 text-white' : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
