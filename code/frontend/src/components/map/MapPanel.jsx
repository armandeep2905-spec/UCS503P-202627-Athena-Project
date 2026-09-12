import { useState, useEffect } from 'react';
import CampusMap from './CampusMap';
import BuildingPopup from './BuildingPopup';
import { useFetch } from '../../hooks/useFetch';
import { getLocations } from '../../api/map';
import Loader from '../ui/Loader';
import ErrorState from '../ui/ErrorState';

export default function MapPanel({ isOpen, onClose, focusBuildingId }) {
  const [selectedId, setSelectedId] = useState(null);
  const { data: buildings, loading, error, execute } = useFetch(getLocations, { immediate: false });

  // Load data when opened
  useEffect(() => {
    if (isOpen && !buildings) {
      execute();
    }
  }, [isOpen, buildings, execute]);

  // Handle focus from outside (e.g. chat)
  useEffect(() => {
    if (isOpen && focusBuildingId) {
      setSelectedId(focusBuildingId);
    }
  }, [isOpen, focusBuildingId]);

  // Handle Escape and Body Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKey = (e) => {
        if (e.key === 'Escape') {
          if (selectedId) setSelectedId(null);
          else onClose();
        }
      };
      document.addEventListener('keydown', handleKey);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
      };
    }
  }, [isOpen, onClose, selectedId]);

  if (!isOpen) return null;

  const selectedBuilding = buildings?.find((b) => b.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-surface/90 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full h-full sm:h-[85vh] sm:max-h-[800px] max-w-6xl bg-surface border border-border sm:rounded-theme-xl shadow-theme-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-surface-alt">
          <div>
            <h2 className="text-lg font-semibold text-on-surface">Campus Map</h2>
            <p className="text-sm text-muted hidden sm:block">Explore buildings and facilities</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-theme-sm text-muted hover:text-on-surface hover:bg-border-light transition-colors"
            aria-label="Close map"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-surface-alt/30 flex flex-col sm:flex-row overflow-hidden">
          {/* Main Map Area */}
          <div className="flex-1 p-2 sm:p-6 relative" onClick={() => setSelectedId(null)}>
            {loading ? (
              <Loader text="Loading map data..." className="h-full" />
            ) : error ? (
              <ErrorState message="Failed to load locations." onRetry={execute} />
            ) : buildings ? (
              <CampusMap
                buildings={buildings}
                selectedBuildingId={selectedId}
                onBuildingSelect={setSelectedId}
              />
            ) : null}
          </div>

          {/* Side Panel for Building Details (Desktop) / Bottom Sheet (Mobile) */}
          {selectedBuilding && (
            <div className="
              absolute sm:static bottom-0 left-0 right-0
              w-full sm:w-80 lg:w-96
              bg-surface border-t sm:border-t-0 sm:border-l border-border
              shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] sm:shadow-none
              flex flex-col z-10 transition-transform duration-300
              max-h-[50vh] sm:max-h-full overflow-y-auto
            ">
               <BuildingPopup
                 building={selectedBuilding}
                 onClose={() => setSelectedId(null)}
               />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
