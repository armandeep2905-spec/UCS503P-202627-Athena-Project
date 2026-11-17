export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-theme-md text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-primary text-on-primary hover:bg-primary-hover shadow-theme-sm border border-transparent',
    secondary:
      'bg-surface-raised text-on-surface border border-border hover:bg-surface-alt hover:border-border/80 shadow-theme-sm',
    ghost:
      'text-secondary hover:text-on-surface hover:bg-surface-alt border border-transparent',
    danger:
      'bg-danger text-white hover:opacity-90 shadow-theme-sm border border-transparent',
    accent:
      'bg-accent text-white hover:bg-accent-hover shadow-theme-sm border border-transparent',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-3.5 py-2 gap-2 h-9',
    lg: 'text-sm px-4.5 py-2.5 gap-2 h-10',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5 text-current shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
