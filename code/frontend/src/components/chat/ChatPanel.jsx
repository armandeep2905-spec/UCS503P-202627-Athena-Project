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
      text: "Hello! I'm Athena, your campus assistant. Ask me anything about your college — academics, facilities, events, or campus navigation.",
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

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
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
      const { data } = await sendQuery(text);
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.answer,
        sources: data.sources || [],
        locationId: data.locationId,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: 'Sorry, I encountered an error. Please try again.',
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
    <div className="fixed inset-0 z-50 flex items-end justify-end p-0 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm sm:bg-transparent"
        onClick={onClose}
      />

      {/* Chat panel */}
      <div className="relative w-full sm:w-96 h-full sm:h-[600px] sm:max-h-[80vh] bg-surface-raised border border-border sm:rounded-theme-xl shadow-theme-xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt sm:rounded-t-theme-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-on-primary text-xs font-bold">A</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-on-surface">Athena</h3>
              <p className="text-xs text-muted">Campus Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-theme-sm text-muted hover:text-on-surface hover:bg-surface transition-colors"
            aria-label="Close chat"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
