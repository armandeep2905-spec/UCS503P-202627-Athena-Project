import { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';

const SEMESTERS = [
  { code: 'ALL', label: 'All Semesters' },
  { code: 'Semester I', label: 'Sem I' },
  { code: 'Semester II', label: 'Sem II' },
  { code: 'Semester III', label: 'Sem III' },
  { code: 'Semester IV', label: 'Sem IV' },
  { code: 'Semester V', label: 'Sem V' },
  { code: 'Semester VI', label: 'Sem VI' },
  { code: 'Semester VII', label: 'Sem VII' },
  { code: 'Semester VIII', label: 'Sem VIII' },
  { code: 'Elective', label: 'Electives' },
];

export default function CourseTable({ courses = [] }) {
  const [search, setSearch] = useState('');
  const [selectedSem, setSelectedSem] = useState('ALL');

  const courseList = useMemo(() => {
    if (Array.isArray(courses)) return courses;
    if (courses && Array.isArray(courses.results)) return courses.results;
    return [];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = (search || '').toLowerCase().trim();

    return courseList.filter((course) => {
      if (!course) return false;
      const code = String(course.code || course.course_code || '').toLowerCase();
      const name = String(course.name || course.course_name || '').toLowerCase();
      const sem = String(course.semester || course.faculty || '').toLowerCase();

      const matchesSearch = !q || code.includes(q) || name.includes(q) || sem.includes(q);
      const matchesSem =
        selectedSem === 'ALL' ||
        sem.includes(selectedSem.toLowerCase());

      return matchesSearch && matchesSem;
    });
  }, [courseList, search, selectedSem]);

  const totalCredits = useMemo(() => {
    return filteredCourses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);
  }, [filteredCourses]);

  if (!courseList || courseList.length === 0) {
    return (
      <Card className="text-center py-10">
        <p className="text-xs text-muted">No course records retrieved from database.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Summary Counters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search code or title (e.g. UCS301, Data Structures)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search courses"
          />
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-theme-sm bg-surface-raised text-on-surface border border-border">
            {filteredCourses.length} Courses
          </span>
          <span className="px-2.5 py-1 rounded-theme-sm bg-surface-alt text-secondary border border-border">
            {totalCredits.toFixed(1)} Credits Total
          </span>
        </div>
      </div>

      {/* Semester Segment Filters */}
      <div className="flex flex-wrap gap-1.5 pb-1">
        {SEMESTERS.map((sem) => (
          <button
            key={sem.code}
            onClick={() => setSelectedSem(sem.code)}
            className={`px-2.5 py-1 rounded-theme-sm text-xs font-mono transition-colors duration-150 border ${
              selectedSem === sem.code
                ? 'bg-primary text-on-primary border-primary shadow-theme-sm'
                : 'bg-surface-raised border-border text-secondary hover:text-on-surface hover:bg-surface-alt'
            }`}
          >
            {sem.label}
          </button>
        ))}
      </div>

      {/* Course Registry Ledger Table */}
      <Card padding={false} className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-surface-alt/70 border-b border-border text-secondary font-mono">
              <tr>
                <th className="px-4 py-2.5 font-medium w-28">Code</th>
                <th className="px-4 py-2.5 font-medium">Course Title</th>
                <th className="px-4 py-2.5 font-medium w-36">Track / Sem</th>
                <th className="px-4 py-2.5 font-medium text-center w-20">Credits</th>
                <th className="px-4 py-2.5 font-medium text-right w-24">Syllabus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface-raised font-sans">
              {filteredCourses.map((course, idx) => {
                const code = course.code || course.course_code || `COURSE-${idx}`;
                const name = course.name || course.course_name || 'Untitled Course';
                const sem = course.semester || course.faculty || 'Core';
                const credits = course.credits != null ? Number(course.credits).toFixed(1) : '—';
                const syllabus =
                  course.syllabusLink ||
                  course.syllabus_link ||
                  'https://www.thapar.edu/upload/files/BECSE_2024.pdf';

                return (
                  <tr key={`${code}-${idx}`} className="hover:bg-surface-alt/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-on-surface">
                      {code}
                    </td>
                    <td className="px-4 py-3 text-on-surface font-medium">
                      {name}
                    </td>
                    <td className="px-4 py-3 text-secondary text-xs">
                      {sem}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-medium text-on-surface">
                      {credits}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={syllabus}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
                      >
                        PDF
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
