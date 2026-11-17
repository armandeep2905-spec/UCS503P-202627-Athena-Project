import Card from '../ui/Card';

export default function SocietyCard({ society = {} }) {
  const name = society?.name || society?.society_name || 'Society';
  const initial = name.trim().charAt(0).toUpperCase() || 'S';
  const eventCount = society?.events?.length || 0;

  return (
    <Card className="flex flex-col h-full hover:border-secondary/30 transition-colors p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-theme-sm bg-surface-alt flex items-center justify-center shrink-0 border border-border text-xs font-mono font-medium text-secondary">
          {initial}
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-semibold text-on-surface truncate leading-tight">{name}</h3>
          <p className="text-[10px] font-mono text-muted leading-tight mt-0.5">
            {eventCount} {eventCount === 1 ? 'Event' : 'Events'}
          </p>
        </div>
      </div>
      <p className="text-xs text-secondary line-clamp-3 mb-3 flex-grow leading-relaxed">
        {society?.description || 'Registered campus student society.'}
      </p>
      <span className="text-xs font-mono text-primary hover:underline self-start">
        Details & Notices →
      </span>
    </Card>
  );
}
