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

    const res = await verifyEmail(email, selectedInst.domain);

    if (res.error) {
      setVerifyError(res.error.detail || 'Verification failed.');
      setVerifyLoading(false);
    } else {
      selectInstitution(selectedInst);
      markVerified();
      // We don't save the email here, just navigate to register where they fill out the full form
      navigate('/register', { state: { prefilledEmail: email } });
    }
  };

  const filteredInstitutions = institutions?.filter(inst =>
    inst.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell showBack={true} title="Select Institution">
      <div className="max-w-3xl mx-auto py-8">
        {!selectedInst ? (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-on-surface mb-2">Find your college</h2>
            <p className="text-muted mb-6">Select your institution to access verified campus information.</p>

            <Input
              placeholder="Search institutions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-6"
            />

            {loading ? (
              <Loader />
            ) : error ? (
              <ErrorState onRetry={execute} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredInstitutions?.map((inst) => (
                  <Card
                    key={inst.id}
                    onClick={() => handleSelect(inst)}
                    className="cursor-pointer hover:border-primary transition-colors flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded bg-surface-alt flex items-center justify-center shrink-0 border border-border">
                      {inst.logo ? <img src={inst.logo} alt={inst.name} /> : <span className="font-bold text-muted">{inst.name.charAt(0)}</span>}
                    </div>
                    <div>
                      <h3 className="font-semibold text-on-surface line-clamp-1">{inst.name}</h3>
                      <p className="text-xs text-muted">@{inst.domain}</p>
                    </div>
                  </Card>
                ))}
                {filteredInstitutions?.length === 0 && (
                  <div className="col-span-full py-8 text-center text-muted">
                    No institutions found matching "{search}".
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in max-w-md mx-auto">
            <button
              onClick={() => setSelectedInst(null)}
              className="text-sm text-primary font-medium hover:underline mb-6 inline-flex items-center gap-1"
            >
              ← Back to list
            </button>

            <Card className="text-center mb-6 py-8">
              <div className="w-16 h-16 rounded-theme-lg bg-surface-alt flex items-center justify-center mx-auto mb-4 border border-border">
                 <span className="text-2xl font-bold text-muted">{selectedInst.name.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-bold text-on-surface mb-1">{selectedInst.name}</h2>
              <p className="text-sm text-muted">Please verify your affiliation.</p>
            </Card>

            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                label="Institutional Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`student@${selectedInst.domain}`}
                error={verifyError}
              />
              <Button type="submit" className="w-full" loading={verifyLoading}>
                Verify Email
              </Button>
            </form>
          </div>
        )}
      </div>
    </PageShell>
  );
}
