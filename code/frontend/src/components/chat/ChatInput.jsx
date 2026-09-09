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
      className="border-t border-border px-3 py-3 flex items-center gap-2 bg-surface"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask Athena anything..."
        disabled={disabled}
        className="flex-1 px-3 py-2 text-sm bg-surface-alt border border-border rounded-theme-md text-on-surface placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
        aria-label="Type your question"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="p-2 rounded-theme-md bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-40 transition-colors"
        aria-label="Send message"
      >
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
}
