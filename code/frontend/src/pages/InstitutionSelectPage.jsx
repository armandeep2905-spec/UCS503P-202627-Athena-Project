import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import { useInstitution } from '../context/InstitutionContext';
import { useFetch } from '../hooks/useFetch';
import { getInstitutions } from '../api/institutions';
import { verifyEmail } from '../api/auth';

export default function InstitutionSelectPage() {
  const navigate = useNavigate();
  const { selectInstitution, markVerified } = useInstitution();
  const { data: institutions, loading, error, execute } = useFetch(getInstitutions);

  const [search, setSearch] = useState('');
  const [selectedInst, setSelectedInst] = useState(null);
  const [email, setEmail] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const handleSelect = (inst) => {
    setSelectedInst(inst);
    setVerifyError('');
    setEmail('');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !selectedInst) return;

    setVerifyLoading(true);
    setVerifyError('');

    const targetDomain = selectedInst.domain || selectedInst.email_domain || 'thapar.edu';
    const res = await verifyEmail(email, targetDomain);

    if (res.error) {
      setVerifyError(res.error.detail || 'Verification failed. Please use your valid @thapar.edu address.');
      setVerifyLoading(false);
    } else {
      selectInstitution(selectedInst);
      markVerified();
      navigate('/register', { state: { prefilledEmail: email } });
    }
  };

  const filteredInstitutions = institutions?.filter((inst) =>
    inst.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell showBack={true} title="Enrollment Verification">
      <div className="max-w-2xl mx-auto py-8">
        {!selectedInst ? (
          <div className="animate-fade-in space-y-5">
            <div className="pb-3 border-b border-border">
              <h2 className="text-base font-semibold text-on-surface">Select Institutional Campus</h2>
              <p className="text-xs text-secondary mt-0.5">
                Verify your institutional domain to load verified course schemes and schedules
              </p>
            </div>

            <Input
              placeholder="Search by institution name (e.g. Thapar Institute)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {loading ? (
              <Loader />
            ) : error ? (
              <ErrorState onRetry={execute} />
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredInstitutions?.map((inst) => (
                  <Card
                    key={inst.id}
                    onClick={() => handleSelect(inst)}
                    className="cursor-pointer hover:border-secondary/40 transition-colors flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-theme-sm bg-surface-alt border border-border flex items-center justify-center font-mono font-medium text-secondary text-sm">
                        {inst.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-on-surface leading-tight">
                          {inst.name}
                        </h3>
                        <p className="text-[11px] font-mono text-muted mt-0.5">
                          @{inst.domain || inst.email_domain || 'thapar.edu'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-primary">Select →</span>
                  </Card>
                ))}
                {filteredInstitutions?.length === 0 && (
                  <div className="py-8 text-center text-xs text-muted font-mono">
                    No institutions found matching "{search}".
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in max-w-sm mx-auto space-y-5">
            <button
              onClick={() => setSelectedInst(null)}
              className="text-xs text-secondary hover:text-on-surface inline-flex items-center gap-1 font-mono"
            >
              ← Back to institution list
            </button>

            <Card className="text-left p-5 border border-border bg-surface-raised">
              <div className="flex items-center gap-3 pb-3 border-b border-border mb-4">
                <div className="w-8 h-8 rounded-theme-sm bg-surface-alt border border-border flex items-center justify-center font-mono text-xs text-secondary">
                  {selectedInst.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-on-surface">{selectedInst.name}</h3>
                  <span className="text-[10px] font-mono text-muted">Domain verification required</span>
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <Input
                  label="Institutional Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`student@${selectedInst.domain || selectedInst.email_domain || 'thapar.edu'}`}
                  error={verifyError}
                />
                <Button type="submit" className="w-full h-9" loading={verifyLoading}>
                  Verify & Proceed
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </PageShell>
  );
}
