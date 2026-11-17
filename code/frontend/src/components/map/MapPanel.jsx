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

  useEffect(() => {
    if (isOpen && !buildings) {
      execute();
    }
  }, [isOpen, buildings, execute]);

  useEffect(() => {
    if (isOpen && focusBuildingId) {
      setSelectedId(focusBuildingId);
    }
  }, [isOpen, focusBuildingId]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-5 bg-black/30 backdrop-blur-[1px] animate-fade-in">
      <div className="relative w-full h-full sm:h-[85vh] sm:max-h-[780px] max-w-5xl bg-surface-raised border border-border sm:rounded-theme-lg shadow-theme-xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border bg-surface-alt/70">
          <div>
            <h2 className="text-xs font-semibold text-on-surface">Campus Landmarks & Navigation</h2>
            <p className="text-[10px] font-mono text-muted hidden sm:block">
              TIET Patiala • 30.3564° N, 76.3647° E • Academic & Residential Zones
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-theme-sm text-secondary hover:text-on-surface hover:bg-surface transition-colors"
            aria-label="Close campus map"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Canvas */}
        <div className="flex-1 relative bg-surface-alt/20 flex flex-col sm:flex-row overflow-hidden">
          <div className="flex-1 p-2 sm:p-5 relative" onClick={() => setSelectedId(null)}>
            {loading ? (
              <Loader text="Loading campus coordinates..." className="h-full" />
            ) : error ? (
              <ErrorState message="Unable to load campus coordinates." onRetry={execute} />
            ) : buildings ? (
              <CampusMap
                buildings={buildings}
                selectedBuildingId={selectedId}
                onBuildingSelect={setSelectedId}
              />
            ) : null}
          </div>

          {selectedBuilding && (
            <div className="
              absolute sm:static bottom-0 left-0 right-0
              w-full sm:w-80 lg:w-96
              bg-surface-raised border-t sm:border-t-0 sm:border-l border-border
              shadow-theme-lg sm:shadow-none
              flex flex-col z-10 transition-transform duration-200
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
