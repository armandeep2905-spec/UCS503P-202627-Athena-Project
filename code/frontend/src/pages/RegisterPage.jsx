import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useInstitution } from '../context/InstitutionContext';
import { flattenErrors } from '../api/client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { selectedInstitution, isVerified } = useInstitution();

  const [name, setName] = useState('');
  const [email, setEmail] = useState(location.state?.prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If they somehow land here without verifying, send them back
  useEffect(() => {
    if (!selectedInstitution || !isVerified) {
      navigate('/select-institution', { replace: true });
    }
  }, [selectedInstitution, isVerified, navigate]);

  if (!selectedInstitution) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register({
      name,
      email,
      password,
      institutionId: selectedInstitution.id
    });

    if (res.error) {
      setError(flattenErrors(res.error));
      setLoading(false);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <PageShell showBack={true} title="Create Account">
      <div className="flex justify-center py-8">
        <Card className="w-full max-w-md p-8 animate-fade-in">
          <div className="mb-6 pb-6 border-b border-border text-center">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-light text-success border border-success/20 mb-3">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Institution Verified
            </span>
            <h2 className="text-lg font-bold text-on-surface">{selectedInstitution.name}</h2>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-danger-light text-danger text-sm rounded-theme-md border border-danger/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
            <Input
              label="Institutional Email"
              type="email"
              required
              readOnly
              value={email}
              className="bg-surface-alt text-muted cursor-not-allowed"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
            />
            <Button type="submit" className="w-full mt-2" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
