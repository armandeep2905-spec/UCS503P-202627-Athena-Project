import Card from '../ui/Card';

export default function ReminderCard({ reminder }) {
  const isPast = new Date(reminder.date) < new Date(new Date().setHours(0,0,0,0));
  const isSoon = !isPast && new Date(reminder.date) <= new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000); // within 3 days

  return (
    <Card className="flex flex-col h-full group hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className={`
          px-2.5 py-1 text-xs font-semibold rounded-theme-sm border
          ${isPast ? 'bg-surface-alt text-muted border-border' :
            isSoon ? 'bg-warning-light text-warning border-warning/20' :
            'bg-success-light text-success border-success/20'}
        `}>
          {new Date(reminder.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <h4 className="text-sm font-semibold text-on-surface mb-1 line-clamp-2">{reminder.title}</h4>
      <p className="text-xs text-muted line-clamp-3 mt-auto">{reminder.note}</p>
    </Card>
  );
}
