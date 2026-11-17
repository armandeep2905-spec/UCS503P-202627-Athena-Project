import Card from '../ui/Card';

export default function EventCard({ event = {} }) {
  const title = event?.title || event?.event_name || 'Campus Event';
  const venue = event?.venue || event?.location || 'Campus';
  const rawDate = event?.date || event?.event_date;

  let month = 'EVT';
  let day = '•';

  if (rawDate) {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      day = d.getDate();
    } else {
      const parts = String(rawDate).split('-');
      if (parts.length === 3) {
        day = parts[2];
        const monthNum = parseInt(parts[1], 10);
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        if (monthNum >= 1 && monthNum <= 12) month = months[monthNum - 1];
      }
    }
  }

  return (
    <Card className="flex flex-col sm:flex-row gap-4 hover:border-secondary/30 transition-colors p-4">
      {/* Date Marker */}
      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-theme-md bg-surface-alt text-on-surface shrink-0 border border-border">
        <span className="text-[10px] font-mono text-muted uppercase leading-none">{month}</span>
        <span className="text-base font-semibold leading-tight font-mono mt-0.5">{day}</span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
          <h3 className="text-xs font-semibold text-on-surface truncate">
            {title}
          </h3>
          <span className="text-[10px] font-mono text-muted shrink-0">
            {venue}
          </span>
        </div>
        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
          {event?.description || 'No additional details provided.'}
        </p>
      </div>
    </Card>
  );
}
