import Card from '../ui/Card';

export default function EventCard({ event }) {
  const d = new Date(event.date);
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();

  return (
    <Card className="flex flex-col sm:flex-row gap-5 hover:border-accent/40 transition-colors group">
      {/* Date Block */}
      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-theme-md bg-accent-light text-accent shrink-0 border border-accent/20">
        <span className="text-[11px] font-bold tracking-wider">{month}</span>
        <span className="text-xl font-bold leading-none">{day}</span>
      </div>

      {/* Details */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          <h3 className="text-base font-semibold text-on-surface group-hover:text-accent transition-colors">
            {event.title}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-alt text-muted border border-border shrink-0">
            {event.venue}
          </span>
        </div>
        <p className="text-sm text-muted line-clamp-2">{event.description}</p>
      </div>
    </Card>
  );
}
