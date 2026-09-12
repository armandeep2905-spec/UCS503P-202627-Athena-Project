import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function PageShell({ children, title, showBack = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-surface">
      {/* Top header bar */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-theme-sm text-muted hover:text-on-surface hover:bg-surface-alt transition-colors"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {title ? (
              <h1 className="text-lg font-semibold text-on-surface">{title}</h1>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-theme-sm bg-primary flex items-center justify-center">
                  <span className="text-on-primary text-sm font-bold">A</span>
                </div>
                <span className="font-semibold text-on-surface">Athena</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && (
              <>
                {isDashboard && user && (
                  <span className="hidden sm:block text-xs text-muted mr-1">
                    {user.name || user.email}
                  </span>
                )}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-2 rounded-theme-sm text-muted hover:text-danger hover:bg-danger-light transition-colors"
                  aria-label="Logout"
                  title="Logout"
                >
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
