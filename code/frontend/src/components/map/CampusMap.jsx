import { useState } from 'react';
import BuildingPopup from './BuildingPopup';

export default function CampusMap({ buildings, selectedBuildingId, onBuildingSelect }) {
  // If the user wants to swap this with an img src later,
  // they can pass it as a prop and render an <img /> instead.
  // We use the inline SVG for now to allow CSS currentColor styling.

  return (
    <div className="relative w-full h-full bg-surface-alt rounded-theme-xl overflow-hidden border border-border flex items-center justify-center min-h-[400px]">
      {/* Map Base */}
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        {/* The user will need to place their map image as "campus-map.jpg" in the public/ folder */}
        <img 
          src="/campus-map.jpg" 
          alt="Campus Map" 
          className="w-full h-full object-contain pointer-events-none drop-shadow-md"
          onError={(e) => {
             // Fallback if the image isn't there yet
             e.target.style.display = 'none';
             e.target.parentNode.innerHTML = '<div class="text-center text-muted border-2 border-dashed border-border rounded-xl p-8 w-full h-full flex items-center justify-center"><span>Please save your map image as <strong>public/campus-map.jpg</strong></span></div>';
          }}
        />
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
