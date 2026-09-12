export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-surface-alt border border-border rounded-theme-lg rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-muted rounded-full"
            style={{
              animation: 'pulse-dot 1.2s infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
