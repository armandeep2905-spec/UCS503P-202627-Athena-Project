export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-surface-raised border border-border rounded-theme-md px-3.5 py-2.5 flex items-center gap-1.5 shadow-theme-sm">
        <span className="text-[10px] font-mono text-muted mr-1">Searching directory</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-secondary/60 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
