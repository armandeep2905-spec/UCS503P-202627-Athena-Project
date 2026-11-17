import { Link } from 'react-router-dom';
import Card from '../ui/Card';

export default function NavTile({ to, title, description, icon }) {
  return (
    <Link
      to={to}
      className="block group h-full focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-theme-lg"
    >
      <Card className="h-full flex flex-col items-start text-left hover:border-secondary/30 hover:bg-surface-alt/30 transition-colors duration-150 p-5">
        <div className="w-9 h-9 rounded-theme-md bg-surface-alt border border-border flex items-center justify-center text-secondary group-hover:text-primary transition-colors duration-150 mb-3.5">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors duration-150">
          {title}
        </h3>
        <p className="text-xs text-secondary leading-relaxed">{description}</p>
      </Card>
    </Link>
  );
}
