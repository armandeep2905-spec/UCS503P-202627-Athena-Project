export default function BuildingPopup({ building, onClose }) {
  if (!building) return null;

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header with Close for mobile */}
      <div className="flex items-start justify-between p-5 border-b border-border sticky top-0 bg-surface z-10">
        <div>
          <h3 className="text-xl font-bold text-on-surface">{building.name}</h3>
          {/* Optional: Add a category tag here if available */}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 -mr-1.5 -mt-1.5 rounded-theme-sm text-muted hover:text-on-surface hover:bg-surface-alt transition-colors sm:hidden"
          aria-label="Close details"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Photo Placeholder */}
        {building.photo ? (
          <img src={building.photo} alt={building.name} className="w-full h-40 object-cover rounded-theme-md bg-surface-alt border border-border" />
        ) : (
          <div className="w-full h-32 rounded-theme-md bg-surface-alt border border-border flex items-center justify-center text-muted">
            <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-on-surface mb-1.5">About</h4>
          <p className="text-sm text-muted leading-relaxed">{building.description}</p>
        </div>

        {/* Departments */}
        {building.departments && building.departments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-2">Departments</h4>
            <div className="flex flex-wrap gap-2">
              {building.departments.map((dept, i) => (
                <span key={i} className="inline-flex px-2.5 py-1 rounded-theme-sm bg-primary-light text-primary text-xs font-medium">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Facilities */}
        {building.facilities && building.facilities.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-2">Facilities</h4>
            <ul className="grid grid-cols-1 gap-1.5">
              {building.facilities.map((fac, i) => (
                <li key={i} className="text-sm text-muted flex items-start gap-2">
                  <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{fac}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Floors */}
        {building.floors && building.floors.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-2">Floors</h4>
            <div className="flex flex-wrap gap-1.5">
               {building.floors.map((floor, i) => (
                 <span key={i} className="inline-flex px-2 py-1 rounded border border-border text-xs text-muted">
                   {floor}
                 </span>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer (Extensibility for routing later) */}
      <div className="p-4 border-t border-border bg-surface-alt mt-auto">
        <button
          disabled
          className="w-full px-4 py-2 bg-surface text-muted border border-border rounded-theme-md text-sm font-medium cursor-not-allowed opacity-70"
        >
          Navigate Here (Coming Soon)
        </button>
      </div>
    </div>
  );
}
