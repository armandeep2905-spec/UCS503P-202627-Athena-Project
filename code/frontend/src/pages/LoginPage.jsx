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
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-on-surface mb-2">Welcome Back</h1>
            <p className="text-sm text-muted">Log in to access your campus dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-danger-light text-danger text-sm rounded-theme-md border border-danger/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@college.edu"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/select-institution" className="text-primary hover:underline font-medium">
              Find your institution
            </Link>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
