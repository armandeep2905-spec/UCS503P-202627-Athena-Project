import { useNavigate, useLocation, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function PageShell({ children, title, showBack = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack ? (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-theme-sm text-secondary hover:text-on-surface hover:bg-surface-alt transition-colors"
                aria-label="Go back"
                title="Go back"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : null}

            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-theme-sm bg-primary text-on-primary flex items-center justify-center font-semibold text-xs tracking-wider shadow-theme-sm">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors">
                  Athena
                </span>
                <span className="text-[10px] text-muted leading-tight font-mono">
                  TIET • 30.3564° N
                </span>
              </div>
            </Link>

            {title && (
              <div className="flex items-center gap-2 pl-3 border-l border-border ml-1">
                <span className="text-sm font-medium text-secondary">{title}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1 mr-2 text-xs">
                <Link
                  to="/dashboard"
                  className={`px-2.5 py-1.5 rounded-theme-sm transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'bg-surface-alt text-on-surface font-medium'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/academics"
                  className={`px-2.5 py-1.5 rounded-theme-sm transition-colors ${
                    location.pathname === '/academics'
                      ? 'bg-surface-alt text-on-surface font-medium'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Academics
                </Link>
                <Link
                  to="/societies-events"
                  className={`px-2.5 py-1.5 rounded-theme-sm transition-colors ${
                    location.pathname === '/societies-events'
                      ? 'bg-surface-alt text-on-surface font-medium'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Events
                </Link>
                <Link
                  to="/navigation"
                  className={`px-2.5 py-1.5 rounded-theme-sm transition-colors ${
                    location.pathname === '/navigation'
                      ? 'bg-surface-alt text-on-surface font-medium'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Map
                </Link>
              </nav>
            )}

            <ThemeToggle />

            {isAuthenticated && user && (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <span className="hidden sm:inline-block text-xs font-mono text-secondary max-w-[150px] truncate">
                  {user.name || user.email}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-1.5 rounded-theme-sm text-muted hover:text-danger hover:bg-danger-light transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Canvas */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {children}
      </main>

      {/* Institutional Colophon Footer */}
      <footer className="border-t border-border mt-auto py-5 text-center text-xs text-muted">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Thapar Institute of Engineering & Technology, Patiala</span>
          <span className="font-mono text-[11px] text-muted">Athena Campus Platform • Autumn 2026</span>
        </div>
      </footer>
    </div>
  );
}
