import { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const DEPARTMENTS = [
  { code: 'ALL', label: 'All Departments' },
  { code: 'CSED', label: 'Computer Science (CSED)' },
  { code: 'ECED', label: 'Electronics (ECED)' },
  { code: 'EIED', label: 'Electrical & Inst. (EIED)' },
  { code: 'MED', label: 'Mechanical (MED)' },
  { code: 'CED', label: 'Civil (CED)' },
  { code: 'CHED', label: 'Chemical (CHED)' },
  { code: 'BTD', label: 'Biotechnology (BTD)' },
];

export default function FacultyDirectory({ facultyList = [] }) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(24);

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
    <div className="space-y-4">
      {/* Search and Metadata Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search 474+ faculty by name, department, or designation..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(24);
            }}
            aria-label="Search faculty directory"
          />
        </div>
        <div className="text-xs font-mono text-muted">
          Showing {Math.min(visibleCount, filteredFaculty.length)} of {filteredFaculty.length} faculty
        </div>
      </div>

      {/* Department Filter Segments */}
      <div className="flex flex-wrap gap-1.5 pb-1">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.code}
            onClick={() => {
              setSelectedDept(dept.code);
              setVisibleCount(24);
            }}
            className={`px-2.5 py-1 rounded-theme-sm text-xs font-mono transition-colors duration-150 border ${
              selectedDept === dept.code
                ? 'bg-primary text-on-primary border-primary shadow-theme-sm'
                : 'bg-surface-raised border-border text-secondary hover:text-on-surface hover:bg-surface-alt'
            }`}
          >
            {dept.label}
          </button>
        ))}
      </div>

      {/* Faculty Cards Grid */}
      {displayedFaculty && displayedFaculty.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {displayedFaculty.map((faculty, idx) => {
              const name = faculty.name || 'Faculty Member';
              const designation = faculty.designation || 'Faculty';
              const department = faculty.department_name || faculty.department || 'TIET Campus';
              const contact = faculty.email || faculty.contact || 'N/A';
              const office = faculty.office || 'TIET Patiala';

              const initials =
                name
                  .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, '')
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('') || 'TI';

              return (
                <Card
                  key={`${name}-${idx}`}
                  className="flex flex-col justify-between hover:border-secondary/40 transition-colors p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-theme-sm bg-surface-alt border border-border text-secondary flex items-center justify-center font-mono text-xs font-medium shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-semibold text-on-surface leading-tight truncate">
                        {name}
                      </h3>
                      <p className="text-[11px] text-secondary leading-tight truncate mt-0.5">
                        {designation}
                      </p>
                      <p className="text-[10px] font-mono text-muted truncate mt-0.5">
                        {department}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/70 space-y-1 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-secondary">
                      <span className="text-muted text-[10px]">Email:</span>
                      {contact && contact !== 'N/A' ? (
                        <a
                          href={`mailto:${contact}`}
                          className="text-primary hover:underline truncate max-w-[190px]"
                        >
                          {contact}
                        </a>
                      ) : (
                        <span className="text-muted">Not listed</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-muted text-[10px]">
                      <span>Location:</span>
                      <span className="truncate max-w-[180px]">{office}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {visibleCount < filteredFaculty.length && (
            <div className="text-center pt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setVisibleCount((prev) => prev + 24)}
              >
                Load {Math.min(24, filteredFaculty.length - visibleCount)} More Records
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-10">
          <p className="text-xs text-muted">No faculty records match your criteria.</p>
        </Card>
      )}
    </div>
  );
}
