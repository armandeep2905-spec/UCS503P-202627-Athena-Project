import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, className = '', id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-secondary mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          w-full px-3 py-2 rounded-theme-md border bg-surface-raised text-on-surface
          placeholder:text-muted text-sm h-9
          transition-colors duration-150
          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-danger ring-1 ring-danger' : 'border-border hover:border-secondary/30'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
});

export default Input;
