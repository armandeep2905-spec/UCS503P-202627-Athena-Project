import { useState, useEffect } from 'react';
import ChatPanel from '../chat/ChatPanel';
import MapPanel from '../map/MapPanel';

/**
 * Global Floating Dock — Athena Assistant & Campus Map
 * Clean, quiet collegiate dock with keyboard accessibility.
 */
export default function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [focusBuildingId, setFocusBuildingId] = useState(null);

  // Keyboard shortcut: Cmd/Ctrl + K opens Athena
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setChatOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleViewOnMap = (locationId) => {
    setChatOpen(false);
    setFocusBuildingId(locationId);
    setMapOpen(true);
  };

  return (
    <>
      {/* Floating Action Dock — bottom right, quiet and aligned */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        {/* Map Shortcut Button */}
        <button
          onClick={() => {
            setMapOpen(true);
            setFocusBuildingId(null);
          }}
          className="h-10 px-3 rounded-theme-md bg-surface-raised text-secondary hover:text-on-surface border border-border shadow-theme-md hover:bg-surface-alt transition-colors duration-150 flex items-center gap-2 text-xs font-medium"
          aria-label="Open campus map"
          title="Campus Map"
        >
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="hidden sm:inline">Campus Map</span>
        </button>

        {/* Primary Athena Assistant Trigger */}
        <button
          onClick={() => setChatOpen(true)}
          className="h-10 px-3.5 rounded-theme-md bg-primary text-on-primary hover:bg-primary-hover shadow-theme-md transition-colors duration-150 flex items-center gap-2 text-xs font-medium"
          aria-label="Ask Athena Campus Assistant"
          title="Ask Athena (⌘K)"
        >
          <svg className="w-4 h-4 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Ask Athena</span>
          <kbd className="hidden sm:inline-block px-1 py-0.5 rounded text-[10px] font-mono bg-black/20 text-white/90">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Slide-over panels */}
      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onViewOnMap={handleViewOnMap}
      />
      <MapPanel
        isOpen={mapOpen}
        onClose={() => {
          setMapOpen(false);
          setFocusBuildingId(null);
        }}
        focusBuildingId={focusBuildingId}
      />
    </>
  );
}
