import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useInstitution } from '../context/InstitutionContext';
import { flattenErrors } from '../api/client';
import { sendOtp } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { selectedInstitution, isVerified } = useInstitution();

  const [step, setStep] = useState('details'); // 'details' | 'otp'
  const [name, setName] = useState('');
  const [email, setEmail] = useState(location.state?.prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!selectedInstitution || !isVerified) {
      navigate('/select-institution', { replace: true });
    }
  }, [selectedInstitution, isVerified, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!selectedInstitution) return null;

  const targetDomain = (selectedInstitution.domain || selectedInstitution.email_domain || 'thapar.edu').toLowerCase();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (emailDomain !== targetDomain) {
      setError(`Only institutional emails with the @${targetDomain} domain can sign up.`);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    const res = await sendOtp(email, 'register');
    setLoading(false);

    if (res.error) {
      setError(flattenErrors(res.error));
    } else {
      setStep('otp');
      setResendCooldown(60);
      setInfoMessage(`Verification code sent to ${email}. Valid for 10 minutes.`);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setLoading(true);

    const res = await sendOtp(email, 'register');
    setLoading(false);

    if (res.error) {
      setError(flattenErrors(res.error));
    } else {
      setResendCooldown(60);
      setInfoMessage(`New verification code sent to ${email}.`);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      password,
      otp: cleanOtp,
      institutionId: selectedInstitution.id,
    });
    setLoading(false);

    if (res.error) {
      setError(flattenErrors(res.error));
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
            <h1 className="text-base font-semibold text-on-surface">
              {step === 'details' ? 'Complete Registration' : 'Verify Email Address'}
            </h1>
            <p className="text-xs text-secondary mt-0.5 font-mono">
              {step === 'details'
                ? 'Create your Athena portal credentials'
                : `Enter the code sent to ${email}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger-light text-danger text-xs rounded-theme-md border border-danger/30 font-mono">
              {error}
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-3 bg-primary-light text-primary text-xs rounded-theme-md border border-primary/30 font-mono">
              {infoMessage}
            </div>
          )}
          {step === 'details' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arman Sharma"
              />
              <Input
                label="Institutional Email (@thapar.edu)"
                type="email"
                required
                readOnly={!!location.state?.prefilledEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={location.state?.prefilledEmail ? "bg-surface-alt text-muted cursor-not-allowed font-mono text-xs" : "font-mono text-xs"}
                placeholder="rollnumber@thapar.edu"
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
              <p className="text-[11px] text-secondary">
                We will email a 6-digit verification code to confirm enrollment.
              </p>
              <Button type="submit" className="w-full h-9 mt-2" loading={loading}>
                Send Verification Code →
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full h-11 text-center font-mono text-xl tracking-[0.4em] bg-surface-alt border border-border rounded-theme-md focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <Button type="submit" className="w-full h-9 mt-2" loading={loading}>
                Verify & Create Account
              </Button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className={`text-primary hover:underline font-mono ${
                    resendCooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('details');
                    setError('');
                  }}
                  className="text-secondary hover:text-on-surface text-xs"
                >
                  ← Edit Details
                </button>
              </div>
            </form>
          )}

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