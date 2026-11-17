import Card from '../ui/Card';

export default function ReminderCard({ reminder }) {
  const isPast = new Date(reminder.date) < new Date(new Date().setHours(0,0,0,0));
  const isSoon = !isPast && new Date(reminder.date) <= new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);

  return (
    <Card className="flex flex-col h-full hover:border-secondary/30 transition-colors p-4">
      <div className="flex justify-between items-start mb-2.5">
        <span
          className={`
            px-2 py-0.5 text-[11px] font-mono rounded-theme-sm border
            ${
              isPast
                ? 'bg-surface-alt text-muted border-border'
                : isSoon
                ? 'bg-warning-light text-warning border-warning/30'
                : 'bg-surface-alt text-secondary border-border'
            }
          `}
        >
          {new Date(reminder.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      <h4 className="text-xs font-semibold text-on-surface mb-1 line-clamp-2">{reminder.title}</h4>
      <p className="text-[11px] text-muted line-clamp-3 mt-auto leading-relaxed">{reminder.note}</p>
    </Card>
  );
}
