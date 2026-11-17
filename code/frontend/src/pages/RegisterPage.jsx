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

  useEffect(() => {
    if (!selectedInstitution || !isVerified) {
      navigate('/select-institution', { replace: true });
    }
  }, [selectedInstitution, isVerified, navigate]);

  if (!selectedInstitution) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetDomain = (selectedInstitution.domain || selectedInstitution.email_domain || 'thapar.edu').toLowerCase();
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (emailDomain !== targetDomain) {
      setError(`Only emails with the @${targetDomain} domain can be registered.`);
      return;
    }

    setLoading(true);

    const res = await register({
      name,
      email,
      password,
      institutionId: selectedInstitution.id,
    });

    if (res.error) {
      setError(flattenErrors(res.error));
      setLoading(false);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <PageShell showBack={true} title="Create Student Profile">
      <div className="flex justify-center py-8">
        <Card className="w-full max-w-sm p-6 sm:p-7 animate-fade-in border border-border bg-surface-raised shadow-theme-md">
          <div className="mb-5 pb-4 border-b border-border text-left">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-theme-sm text-[11px] font-mono bg-surface-alt text-secondary border border-border mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Verified: {selectedInstitution.name}
            </span>
            <h1 className="text-base font-semibold text-on-surface">Complete Registration</h1>
            <p className="text-xs text-secondary mt-0.5 font-mono">Create your Athena portal credentials</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger-light text-danger text-xs rounded-theme-md border border-danger/30 font-mono">
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
              placeholder="e.g. Arman Sharma"
            />
            <Input
              label="Institutional Email (Verified)"
              type="email"
              required
              readOnly
              value={email}
              className="bg-surface-alt text-muted cursor-not-allowed font-mono text-xs"
            />
            <Input
              label="Choose Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              minLength={8}
            />
            <Button type="submit" className="w-full h-9 mt-2" loading={loading}>
              Create Student Account
            </Button>
          </form>

          <p className="mt-5 pt-4 border-t border-border text-center text-xs text-secondary">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign In →
            </Link>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
