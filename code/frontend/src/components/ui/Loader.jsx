export default function Loader({ text = 'Retrieving records...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-10 ${className}`}>
      <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin" />
      <p className="mt-3 text-xs font-mono text-muted">{text}</p>
    </div>
  );
}
