import { Link } from 'react-router-dom';
import Card from '../ui/Card';

export default function NavTile({ to, title, description, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-light text-primary',
    accent: 'bg-warning-light text-warning',
    info: 'bg-info-light text-info',
    success: 'bg-success-light text-success',
  };

  return (
    <Link to={to} className="block group h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-theme-lg">
      <Card className="h-full flex flex-col items-center text-center hover:border-primary/40 hover:shadow-theme-md transition-all duration-300">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${colorClasses[color] || colorClasses.primary}`}>
          {icon}
        </div>
        <h3 className="text-base font-semibold text-on-surface mb-2">{title}</h3>
        <p className="text-sm text-muted">{description}</p>
      </Card>
    </Link>
  );
}
