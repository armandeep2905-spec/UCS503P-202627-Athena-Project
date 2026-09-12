export default function Loader({ text = 'Loading...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 border-3 border-border rounded-full" />
        <div className="absolute top-0 left-0 w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-sm text-muted">{text}</p>
    </div>
  );
}
