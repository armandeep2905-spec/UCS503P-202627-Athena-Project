export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-8 h-8 rounded-theme-sm bg-danger-light border border-danger/30 text-danger flex items-center justify-center mb-3">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-xs font-semibold text-on-surface">Data Retrieval Notice</h3>
      <p className="mt-1 text-xs text-muted max-w-sm font-mono">
        {message || 'Unable to retrieve records from the campus database.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-3 py-1.5 text-xs font-mono font-medium text-primary hover:underline transition-colors"
        >
          Retry Query →
        </button>
      )}
    </div>
  );
}
