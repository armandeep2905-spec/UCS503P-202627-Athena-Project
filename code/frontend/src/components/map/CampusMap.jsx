import { useState } from 'react';
import BuildingPopup from './BuildingPopup';

export default function CampusMap({ buildings, selectedBuildingId, onBuildingSelect }) {
  // If the user wants to swap this with an img src later,
  // they can pass it as a prop and render an <img /> instead.
  // We use the inline SVG for now to allow CSS currentColor styling.

  return (
    <div className="relative w-full h-full bg-surface-alt rounded-theme-xl overflow-hidden border border-border flex items-center justify-center min-h-[400px]">
      {/* Map Base */}
      <div className="absolute inset-0 p-4">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-border-light drop-shadow-sm">
          {/* Background */}
          <rect width="100" height="100" fill="currentColor" opacity="0.3" rx="4" />
          {/* Roads */}
          <path d="M 0 50 Q 50 50 50 0 M 50 50 Q 50 100 100 100 M 0 80 L 100 80 M 80 0 L 80 100"
                fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="2,2" opacity="0.6" />
          {/* Buildings */}
          <rect x="25" y="20" width="20" height="15" rx="1" fill="currentColor" opacity="0.8" />
          <circle cx="55" cy="25" r="8" fill="currentColor" opacity="0.8" />
          <path d="M 65 40 L 75 40 L 80 50 L 60 50 Z" fill="currentColor" opacity="0.8" />
          <rect x="35" y="50" width="20" height="10" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="15" y="50" width="10" height="20" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="75" y="65" width="15" height="15" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="15" y="70" width="20" height="15" rx="1" fill="currentColor" opacity="0.8" />
        </svg>
      </div>

      {/* Hotspots layer (Data-driven) */}
      <div className="absolute inset-0 p-4 pointer-events-none">
        <div className="relative w-full h-full">
          {buildings.map((b) => {
            if (!b.coordinates) return null;
            const isSelected = b.id === selectedBuildingId;
            return (
              <button
                key={b.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onBuildingSelect(b.id);
                }}
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center transform transition-all duration-200 cursor-pointer pointer-events-auto group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{
                  left: `${b.coordinates.x}%`,
                  top: `${b.coordinates.y}%`
                }}
                aria-label={`Select ${b.name}`}
              >
                {/* Ping animation if selected */}
                {isSelected && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-30 animate-ping"></span>
                )}
                {/* Core dot */}
                <span
                  className={`
                    relative inline-flex rounded-full h-4 w-4 border-2
                    transition-colors duration-200
                    ${isSelected
                      ? 'bg-primary border-surface scale-125 shadow-theme-md'
                      : 'bg-accent border-surface shadow-theme-sm group-hover:scale-110 group-hover:bg-accent-hover'
                    }
                  `}
                ></span>

                {/* Tooltip on hover (hidden on small screens) */}
                {!isSelected && (
                  <div className="absolute bottom-full mb-2 hidden group-hover:block w-max max-w-[150px]">
                    <div className="bg-on-surface text-surface text-xs font-medium px-2 py-1 rounded shadow-theme-sm truncate">
                      {b.name}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
