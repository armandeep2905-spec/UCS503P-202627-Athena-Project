import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const InstitutionContext = createContext(null);

export function InstitutionProvider({ children }) {
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('athena_institution');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedInstitution(parsed.institution);
        setIsVerified(parsed.verified);
      } catch {
        localStorage.removeItem('athena_institution');
      }
    }
  }, []);

  const selectInstitution = useCallback((institution) => {
    setSelectedInstitution(institution);
    setIsVerified(false);
    localStorage.setItem(
      'athena_institution',
      JSON.stringify({ institution, verified: false })
    );
  }, []);

  const markVerified = useCallback(() => {
    setIsVerified(true);
    if (selectedInstitution) {
      localStorage.setItem(
        'athena_institution',
        JSON.stringify({ institution: selectedInstitution, verified: true })
      );
    }
  }, [selectedInstitution]);

  const clearInstitution = useCallback(() => {
    setSelectedInstitution(null);
    setIsVerified(false);
    localStorage.removeItem('athena_institution');
  }, []);

  const value = {
    selectedInstitution,
    isVerified,
    selectInstitution,
    markVerified,
    clearInstitution,
  };

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  );
}

export function useInstitution() {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error('useInstitution must be used within an InstitutionProvider');
  }
  return context;
}
