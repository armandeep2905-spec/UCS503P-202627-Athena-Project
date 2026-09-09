import Card from '../ui/Card';

export default function SocietyCard({ society }) {
  return (
    <Card className="flex flex-col h-full hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-theme-lg bg-surface-alt flex items-center justify-center shrink-0 border border-border">
          {/* Placeholder for society logo */}
          <span className="text-xl font-bold text-muted">{society.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-on-surface line-clamp-1">{society.name}</h3>
          <p className="text-xs text-muted">
            {society.events?.length || 0} Upcoming Event{(society.events?.length !== 1) ? 's' : ''}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted line-clamp-3 mb-4 flex-grow">{society.description}</p>
      <button className="text-sm font-medium text-primary hover:text-primary-hover hover:underline self-start mt-auto">
        View Details →
      </button>
    </Card>
  );
}
