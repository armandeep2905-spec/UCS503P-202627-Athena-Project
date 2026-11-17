import { useState, useRef } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border px-3.5 py-3 flex items-center gap-2 bg-surface-alt/60"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask Athena (e.g. Neeraj mail, sem 3 courses, attendance rules)..."
        disabled={disabled}
        className="flex-1 px-3 py-2 text-sm bg-surface-raised border border-border rounded-theme-md text-on-surface placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 h-9"
        aria-label="Ask a campus question"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="h-9 px-3 rounded-theme-md bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-40 transition-colors flex items-center justify-center shrink-0"
        aria-label="Send query"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </form>
  );
}
