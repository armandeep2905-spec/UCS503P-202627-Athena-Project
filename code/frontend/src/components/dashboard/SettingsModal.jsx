import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import * as authApi from '../../api/auth';

const DEPARTMENTS = [
  { code: 'CSED', name: 'Computer Science & Engineering' },
  { code: 'ECED', name: 'Electronics & Communication Engineering' },
  { code: 'EIED', name: 'Electrical & Instrumentation Engineering' },
  { code: 'MED', name: 'Mechanical Engineering' },
  { code: 'CED', name: 'Civil Engineering' },
  { code: 'CHED', name: 'Chemical Engineering' },
  { code: 'BTD', name: 'Biotechnology' },
];

export default function SettingsModal({ isOpen, onClose }) {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('CSED');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setRollNumber(user.rollNumber || user.roll_number || '');
      const savedBranch = localStorage.getItem('athena_branch') || user.department || 'CSED';
      setBranch(savedBranch);
    }
    setStatusMessage({ type: '', text: '' });
  }, [user, isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await authApi.updateProfile({
        name: name.trim(),
        rollNumber: rollNumber.trim(),
      });

      if (res.error) {
        setStatusMessage({
          type: 'error',
          text: res.error.detail || 'Failed to update profile.',
        });
      } else {
        localStorage.setItem('athena_branch', branch);
        updateUser({
          name: name.trim(),
          rollNumber: rollNumber.trim(),
          department: branch,
        });
        setStatusMessage({
          type: 'success',
          text: 'Profile updated successfully.',
        });
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'An unexpected error occurred while saving.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile & Account" size="md">
      <form onSubmit={handleSave} className="space-y-5">
        {statusMessage.text && (
          <div
            className={`p-3 text-xs rounded-theme-md font-mono border ${
              statusMessage.type === 'success'
                ? 'bg-success-light text-success border-success/30'
                : 'bg-danger-light text-danger border-danger/30'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Profile Details */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
            Profile Details
          </h3>

          <Input
            label="Full Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Arman Sharma"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Roll Number"
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. 102203001"
            />

            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">
                Primary Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full h-9 px-3 rounded-theme-md border border-border bg-surface-raised text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.code} value={dept.code}>
                    {dept.code} ({dept.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary mb-1.5">
              Institutional Email
            </label>
            <div className="flex items-center justify-between px-3 py-2 rounded-theme-md border border-border bg-surface-alt/70 text-xs font-mono text-muted">
              <span>{user?.email || 'student@thapar.edu'}</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                Verified Domain
              </span>
            </div>
          </div>
        </div>

        {/* Appearance & Interface */}
        <div className="pt-3 border-t border-border space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
            Appearance
          </h3>
          <div className="flex items-center justify-between p-3 rounded-theme-md border border-border bg-surface-alt/40">
            <div>
              <p className="text-xs font-medium text-on-surface">Interface Theme</p>
              <p className="text-[11px] text-muted">
                Currently running in <span className="font-mono text-secondary capitalize">{theme}</span> mode
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1.5 text-xs font-medium rounded-theme-sm border border-border bg-surface-raised hover:bg-surface-alt text-on-surface transition-colors flex items-center gap-1.5"
            >
              {theme === 'dark' ? (
                <>
                  <svg className="w-3.5 h-3.5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span>Switch to Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="text-xs text-danger hover:underline font-medium"
          >
            Sign out of Athena
          </button>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={loading}>
              Save Profile
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

