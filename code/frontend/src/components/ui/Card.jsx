export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div
      className={`
        bg-surface-raised border border-border rounded-theme-lg shadow-theme-sm
        transition-shadow duration-200
        ${padding ? 'p-5' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
