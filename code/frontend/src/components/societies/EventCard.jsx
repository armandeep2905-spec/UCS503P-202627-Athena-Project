import Card from '../ui/Card';

export default function EventCard({ event = {} }) {
  const title = event?.title || event?.event_name || 'Campus Event';
  const venue = event?.venue || event?.location || 'Campus';
  const rawDate = event?.date || event?.event_date;

  // Robust Safari-compatible date formatting that will never throw RangeError
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
            {title}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-alt text-muted border border-border shrink-0">
            {venue}
          </span>
        </div>
        <p className="text-sm text-muted line-clamp-2">{event?.description || 'No description available.'}</p>
      </div>
    </Card>
  );
}
