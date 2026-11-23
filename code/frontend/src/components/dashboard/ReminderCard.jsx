import { useState } from 'react';
import Card from '../ui/Card';

export default function ReminderCard({ reminder, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const rawDate = reminder.date || reminder.reminder_date || '';
  const noteText = reminder.note || reminder.description || '';

  const parsedDate = rawDate ? new Date(rawDate) : null;
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());

  const now = new Date(new Date().setHours(0, 0, 0, 0));
  const isPast = isValidDate && parsedDate < now;
  const isSoon = isValidDate && !isPast && parsedDate <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const formattedDate = isValidDate
    ? parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : rawDate || 'No date';

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!onDelete || isDeleting) return;
    setIsDeleting(true);
    await onDelete(reminder.id);
  };

  return (
    <Card className="group relative flex flex-col h-full hover:border-secondary/40 transition-colors p-4 bg-surface-raised border border-border rounded-theme-lg">
      <div className="flex justify-between items-start mb-2.5">
        <span
          className={`
            px-2 py-0.5 text-[11px] font-mono rounded-theme-sm border
            ${
              isPast
                ? 'bg-surface-alt text-muted border-border'
                : isSoon
                ? 'bg-warning-light text-warning border-warning/30 font-medium'
                : 'bg-surface-alt text-secondary border-border'
            }
          `}
        >
          {formattedDate}
        </span>

        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="opacity-70 group-hover:opacity-100 p-1 -mr-1 -mt-1 rounded-theme-sm text-muted hover:text-danger hover:bg-danger-light transition-all"
            title="Delete reminder"
            aria-label="Delete reminder"
          >
            {isDeleting ? (
              <span className="w-3.5 h-3.5 inline-block border-2 border-muted border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        )}
      </div>

      <h4 className="text-xs font-semibold text-on-surface mb-1 line-clamp-2 leading-snug">
        {reminder.title}
      </h4>

      {noteText ? (
        <p className="text-[11px] text-muted line-clamp-3 mt-auto leading-relaxed">
          {noteText}
        </p>
      ) : (
        <span className="text-[10px] text-muted/60 mt-auto italic">No additional notes</span>
      )}
    </Card>
  );
}
