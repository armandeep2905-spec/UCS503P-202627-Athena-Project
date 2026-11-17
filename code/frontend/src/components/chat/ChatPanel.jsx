import { useState, useRef, useEffect } from 'react';
import { sendQuery } from '../../api/query';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

export default function ChatPanel({ isOpen, onClose, onViewOnMap }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Athena is active. You can inquire about official faculty emails, semester course syllabi, attendance requirements, CGPA regulations, or campus buildings.",
      sources: [],
      locationId: null,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSend = async (text) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await sendQuery(text);
      const data = res?.data || {};
      const answer = data?.answer || (typeof data === 'string' ? data : 'No response available.');
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: typeof answer === 'string' ? answer : JSON.stringify(answer),
        sources: Array.isArray(data?.sources) ? data.sources : [],
        locationId: data?.locationId || null,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: 'Unable to reach the campus intelligence service. Please verify your connection.',
          sources: [],
          locationId: null,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-0 sm:p-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-[1px] sm:bg-black/15"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Assistant Drawer */}
      <div className="relative w-full sm:w-[420px] h-[85vh] sm:h-[620px] bg-surface-raised border border-border sm:rounded-theme-lg shadow-theme-xl flex flex-col animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt/70">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-theme-sm bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">
              A
            </div>
            <div>
              <h3 className="text-xs font-semibold text-on-surface leading-tight">
                Athena Assistant
              </h3>
              <p className="text-[10px] font-mono text-muted leading-tight">
                Grounded on TIET Academic Knowledge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-theme-sm text-secondary hover:text-on-surface hover:bg-surface transition-colors"
            aria-label="Close assistant"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-surface/30">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onViewOnMap={onViewOnMap}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Input */}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
