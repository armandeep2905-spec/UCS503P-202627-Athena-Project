import { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';

const DEPARTMENTS = [
  { code: 'ALL', label: 'All Departments' },
  { code: 'CSED', label: 'Computer Science (CSED)' },
  { code: 'ECED', label: 'Electronics (ECED)' },
  { code: 'EIED', label: 'Electrical & Instrumentation (EIED)' },
  { code: 'MED', label: 'Mechanical (MED)' },
  { code: 'CED', label: 'Civil (CED)' },
  { code: 'CHED', label: 'Chemical (CHED)' },
  { code: 'BTD', label: 'Biotechnology (BTD)' },
];

export default function FacultyDirectory({ facultyList = [] }) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(24);

  // Normalize faculty list safely regardless of array vs paginated object
  const list = useMemo(() => {
    if (Array.isArray(facultyList)) return facultyList;
    if (facultyList && Array.isArray(facultyList.results)) return facultyList.results;
    return [];
  }, [facultyList]);

  const filteredFaculty = useMemo(() => {
    const q = (search || '').toLowerCase().trim();

    return list.filter((f) => {
      if (!f) return false;
      const name = String(f.name || '').toLowerCase();
      const dept = String(f.department_name || f.department || '').toLowerCase();
      const deptCode = String(f.departmentCode || '').toUpperCase();
      const desig = String(f.designation || '').toLowerCase();

      const matchesSearch = !q || name.includes(q) || dept.includes(q) || desig.includes(q);

      const matchesDept =
        selectedDept === 'ALL' ||
        deptCode === selectedDept ||
        dept.includes(selectedDept.toLowerCase());

      return matchesSearch && matchesDept;
    });
  }, [list, search, selectedDept]);

  const displayedFaculty = filteredFaculty.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      {/* Search and Department Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search 478 faculty by name, designation, or department..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(24);
            }}
            aria-label="Search faculty"
          />
        </div>
        <div className="text-xs text-muted font-medium">
          Showing {Math.min(visibleCount, filteredFaculty.length)} of {filteredFaculty.length} faculty members
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex flex-wrap gap-2 pt-1 pb-2">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.code}
            onClick={() => {
              setSelectedDept(dept.code);
              setVisibleCount(24);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              selectedDept === dept.code
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface border-border text-muted hover:text-on-surface hover:bg-surface-alt'
            }`}
          >
            {dept.label}
          </button>
        ))}
      </div>

      {/* Faculty Cards Grid */}
      {displayedFaculty && displayedFaculty.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedFaculty.map((faculty, idx) => {
              const name = faculty.name || 'Faculty Member';
              const designation = faculty.designation || 'Faculty';
              const department = faculty.department_name || faculty.department || 'TIET Campus';
              const contact = faculty.email || faculty.contact || 'thapar.edu';
              const office = faculty.office || 'TIET Campus, Patiala';

              // Safely extract initials
              const initials = name
                .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, '')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0])
                .join('') || 'TI';

              return (
                <Card key={faculty.id || idx} className="flex flex-col hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-on-surface truncate" title={name}>
                        {name}
                      </h3>
                      <p className="text-xs font-medium text-primary line-clamp-1">{designation}</p>
                      <p className="text-[11px] text-muted truncate">{department}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs mt-auto pt-3 border-t border-border/60">
                    <div className="flex items-center gap-2 text-muted">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {contact && contact !== 'N/A' ? (
                        <a href={`mailto:${contact}`} className="hover:text-primary transition-colors truncate">
                          {contact}
                        </a>
                      ) : (
                        <span className="truncate">tiinfo@thapar.edu</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="truncate">{office}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredFaculty.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="px-6 py-2 rounded-theme-md bg-surface-alt border border-border text-on-surface text-sm font-medium hover:bg-surface hover:border-primary transition-colors cursor-pointer"
              >
                Load More Faculty ({filteredFaculty.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <p className="text-sm text-muted">No faculty members found matching your search.</p>
        </Card>
      )}
    </div>
  );
}
