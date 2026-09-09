import Card from '../ui/Card';

export default function DateCard({ date, title, description }) {
  const d = new Date(date);
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();

  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-theme-md bg-surface-alt border border-border shrink-0">
        <span className="text-[10px] font-bold text-danger uppercase tracking-wider">{month}</span>
        <span className="text-lg font-bold text-on-surface leading-none">{day}</span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-on-surface">{title}</h4>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
