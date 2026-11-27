import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { flattenErrors } from '../api/client';
import { sendOtp, resetPassword } from '../api/auth';

export default function LoginPage() {
  // Views: 'login' | 'forgot_email' | 'forgot_reset'
  const [view, setView] = useState('login');

  // Sign in state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  // Timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const res = await login(email, password);

    if (res.error) {
      setError(flattenErrors(res.error));
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const targetDomain = 'thapar.edu';
    const emailDomain = forgotEmail.split('@')[1]?.toLowerCase();
    if (emailDomain !== targetDomain) {
      setError(`Institutional recovery codes are only sent to @${targetDomain} addresses.`);
      setLoading(false);
      return;
    }

    const res = await sendOtp(forgotEmail, 'reset_password');
    setLoading(false);

    if (res.error) {
      setError(flattenErrors(res.error));
    } else {
      setView('forgot_reset');
      setResendCooldown(60);
    }
  };

  const handleResendResetOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setLoading(true);

    const res = await sendOtp(forgotEmail, 'reset_password');
    setLoading(false);

    if (res.error) {
      setError(flattenErrors(res.error));
    } else {
      setResendCooldown(60);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanOtp = forgotOtp.trim();
    if (cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit recovery code.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify your new password.');
      return;
    }

    setLoading(true);
    const res = await resetPassword({
      email: forgotEmail,
      otp: cleanOtp,
      newPassword,
    });
    setLoading(false);

    if (res.error) {
      setError(flattenErrors(res.error));
    } else {
      setEmail(forgotEmail);
      setPassword('');
      setForgotOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setDevOtp('');
      setView('login');
      setSuccessMessage('Password reset successfully! Please sign in with your new credentials.');
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
            <h1 className="text-lg font-semibold text-on-surface">
              {view === 'login' && 'Campus Sign In'}
              {view === 'forgot_email' && 'Reset Password'}
              {view === 'forgot_reset' && 'Create New Password'}
            </h1>
            <p className="text-xs text-secondary mt-1">
              {view === 'login' && 'Access your courses, timetable, and assistant'}
              {view === 'forgot_email' && 'Enter your institutional email to receive a recovery code'}
              {view === 'forgot_reset' && `Enter recovery code sent to ${forgotEmail}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger-light text-danger text-xs rounded-theme-md border border-danger/30 font-mono">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-success-light text-success text-xs rounded-theme-md border border-success/30 font-mono">
              {successMessage}
            </div>
          )}

          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Institutional Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@thapar.edu"
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-secondary">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setError('');
                      setSuccessMessage('');
                      setView('forgot_email');
                    }}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>

              <Button type="submit" loading={loading} className="w-full h-9 mt-1">
                Sign In to Athena
              </Button>
            </form>
          )}

          {view === 'forgot_email' && (
            <form onSubmit={handleSendResetOtp} className="space-y-4">
              <Input
                label="Institutional Email (@thapar.edu)"
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="student@thapar.edu"
                className="font-mono text-xs"
              />

              <Button type="submit" loading={loading} className="w-full h-9 mt-1">
                Send Recovery Code →
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setError('');
                  }}
                  className="text-xs text-secondary hover:text-on-surface"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {view === 'forgot_reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">
                  6-Digit Recovery Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full h-11 text-center font-mono text-xl tracking-[0.4em] bg-surface-alt border border-border rounded-theme-md focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <Input
                label="New Password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                minLength={8}
              />

              <Input
                label="Confirm New Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                minLength={8}
              />

              <Button type="submit" loading={loading} className="w-full h-9 mt-1">
                Reset Password
              </Button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResendResetOtp}
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
                    setView('forgot_email');
                    setError('');
                  }}
                  className="text-secondary hover:text-on-surface text-xs"
                >
                  ← Change Email
                </button>
              </div>
            </form>
          )}

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