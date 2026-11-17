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

  // Normalize course list safely regardless of array vs paginated object
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
      <Card className="text-center py-12">
        <p className="text-sm text-muted">No courses found in database.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search by course code, title, or semester (e.g. UCS301, Data Structures)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search courses"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold border border-primary/20">
            {filteredCourses.length} Subjects
          </span>
          <span className="px-3 py-1 rounded-full bg-surface-alt text-on-surface text-xs font-semibold border border-border">
            {totalCredits.toFixed(1)} Total Credits
          </span>
        </div>
      </div>

      {/* Semester Filter Pills */}
      <div className="flex flex-wrap gap-1.5 pb-2">
        {SEMESTERS.map((sem) => (
          <button
            key={sem.code}
            onClick={() => setSelectedSem(sem.code)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
              selectedSem === sem.code
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface border-border text-muted hover:text-on-surface hover:bg-surface-alt'
            }`}
          >
            {sem.label}
          </button>
        ))}
      </div>

      {/* Course Table */}
      <Card padding={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-alt border-b border-border text-on-surface">
              <tr>
                <th className="px-4 py-3 font-semibold">Course Code</th>
                <th className="px-4 py-3 font-semibold">Course Title</th>
                <th className="px-4 py-3 font-semibold">Semester / Track</th>
                <th className="px-4 py-3 font-semibold text-center">Credits</th>
                <th className="px-4 py-3 font-semibold text-center">Syllabus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCourses.map((course, idx) => {
                const code = course.code || course.course_code || `COURSE-${idx}`;
                const name = course.name || course.course_name || 'Untitled Course';
                const sem = course.semester || course.faculty || 'Core';
                const credits = course.credits != null ? Number(course.credits).toFixed(1) : '—';
                const syllabus = course.syllabusLink || course.syllabus_link || 'https://www.thapar.edu/upload/files/BECSE_2024.pdf';

                return (
                  <tr key={course.id || idx} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">{code}</td>
                    <td className="px-4 py-3 text-on-surface font-medium">{name}</td>
                    <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded bg-surface-alt border border-border font-medium">
                        {sem}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface text-center font-semibold">{credits}</td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={syllabus}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Scheme PDF
                      </a>
                    </td>
                  </tr>
                );
              })}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    No subjects found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
