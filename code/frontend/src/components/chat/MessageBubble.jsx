import CitationChip from './CitationChip';

export default function MessageBubble({ message, onViewOnMap }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[85%] rounded-theme-lg px-3.5 py-2.5 text-sm leading-relaxed
          ${isUser
            ? 'bg-primary text-on-primary rounded-br-sm'
            : 'bg-surface-alt text-on-surface border border-border rounded-bl-sm'
          }
        `}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>

        {/* Source citations */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {message.sources.map((source, idx) => (
              <CitationChip key={idx} source={source} />
            ))}
          </div>
        )}

        {/* View on map action */}
        {!isUser && message.locationId && (
          <button
            onClick={() => onViewOnMap(message.locationId)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View on Map
          </button>
        )}
      </div>
    </div>
  );
}
