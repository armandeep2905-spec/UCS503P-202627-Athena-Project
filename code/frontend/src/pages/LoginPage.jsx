import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { flattenErrors } from '../api/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);

    if (res.error) {
      setError(flattenErrors(res.error));
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <PageShell>
      <div className="flex justify-center items-center min-h-[68vh] py-8">
        <Card className="w-full max-w-sm p-6 sm:p-7 animate-fade-in border border-border bg-surface-raised shadow-theme-md">
          <div className="text-left mb-6 pb-4 border-b border-border">
            <div className="inline-block px-2 py-0.5 rounded-theme-sm bg-surface-alt text-muted text-[11px] font-mono mb-2">
              TIET Authentication
            </div>
            <h1 className="text-lg font-semibold text-on-surface">Campus Sign In</h1>
            <p className="text-xs text-secondary mt-1">Access your courses, timetable, and assistant</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger-light text-danger text-xs rounded-theme-md border border-danger/30 font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Institutional Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@thapar.edu"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <Button type="submit" loading={loading} className="w-full h-9 mt-1">
              Sign In to Athena
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-border text-center text-xs text-secondary">
            <span>New to Athena? </span>
            <Link to="/select-institution" className="text-primary hover:underline font-medium">
              Verify Enrollment →
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
