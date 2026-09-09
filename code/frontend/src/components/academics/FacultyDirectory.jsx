import { useState } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';

export default function FacultyDirectory({ facultyList }) {
  const [search, setSearch] = useState('');

  const filteredFaculty = facultyList?.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <Input
          placeholder="Search by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search faculty"
        />
      </div>

      {filteredFaculty && filteredFaculty.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaculty.map((faculty) => (
            <Card key={faculty.id} className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-lg shrink-0">
                  {faculty.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-on-surface">{faculty.name}</h3>
                  <p className="text-xs text-muted">{faculty.department}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mt-auto">
                <div className="flex items-start gap-2 text-muted">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${faculty.contact}`} className="hover:text-primary transition-colors line-clamp-1">{faculty.contact}</a>
                </div>
                <div className="flex items-start gap-2 text-muted">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="line-clamp-1">{faculty.office}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-on-surface mb-1.5">Courses Taught:</p>
                <div className="flex flex-wrap gap-1.5">
                  {faculty.coursesTaught?.map((course, idx) => (
                    <span key={idx} className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded bg-surface-alt border border-border text-muted">
                      {course.split(' — ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No faculty found matching your search.</p>
      )}
    </div>
  );
}
