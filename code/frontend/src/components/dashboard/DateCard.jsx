export default function DateCard({ date, title, description }) {
  const d = new Date(date);
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();

  return (
    <div className="flex gap-3.5 items-center">
      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-theme-md bg-surface-alt border border-border shrink-0">
        <span className="text-[10px] font-mono text-muted uppercase leading-none">{month}</span>
        <span className="text-base font-semibold text-on-surface leading-tight font-mono mt-0.5">{day}</span>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-on-surface">{title}</h4>
        {description && <p className="text-[11px] text-muted mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
