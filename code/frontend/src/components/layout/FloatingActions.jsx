import { useState } from 'react';
import ChatPanel from '../chat/ChatPanel';
import MapPanel from '../map/MapPanel';

/**
 * Two global floating action buttons — query bot + campus map.
 * Rendered on all authenticated pages.
 */
export default function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [focusBuildingId, setFocusBuildingId] = useState(null);

  const handleViewOnMap = (locationId) => {
    setChatOpen(false);
    setFocusBuildingId(locationId);
    setMapOpen(true);
  };

  return (
    <>
      {/* FAB buttons — bottom right, stacked */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Map FAB */}
        <button
          onClick={() => { setMapOpen(true); setFocusBuildingId(null); }}
          className="w-13 h-13 rounded-full bg-accent text-white shadow-theme-lg hover:bg-accent-hover hover:shadow-theme-xl transition-all duration-200 flex items-center justify-center group"
          aria-label="Open campus map"
          title="Campus Map"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </button>

        {/* Chat FAB */}
        <button
          onClick={() => setChatOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-theme-lg hover:bg-primary-hover hover:shadow-theme-xl transition-all duration-200 flex items-center justify-center group"
          aria-label="Ask Athena"
          title="Ask Athena"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      {/* Panels */}
      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onViewOnMap={handleViewOnMap}
      />
      <MapPanel
        isOpen={mapOpen}
        onClose={() => { setMapOpen(false); setFocusBuildingId(null); }}
        focusBuildingId={focusBuildingId}
      />
    </>
  );
}
