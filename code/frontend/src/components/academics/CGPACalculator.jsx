import { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import CourseAutocomplete from './CourseAutocomplete';

const GRADE_POINTS = {
  'A+': 10, 'A': 10, 'A-': 9, 'B': 8, 'B-': 7, 'C': 6, 'C-': 5, 'E': 2, 'F': 0
};

export default function CGPACalculator() {
  const [courses, setCourses] = useState([
    { id: 1, name: 'UCS301 — Data Structures', credits: 4, grade: 'A' },
    { id: 2, name: 'UCS303 — Operating System', credits: 4, grade: 'B' },
    { id: 3, name: 'UTA018 — Object Oriented Programming', credits: 4, grade: 'A+' },
  ]);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', credits: 3.5, grade: 'A' }]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleSelectCourse = (id, selectedCourse) => {
    setCourses(
      courses.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            name: `${selectedCourse.code} — ${selectedCourse.name}`,
            credits: selectedCourse.credits,
          };
        }
        return c;
      })
    );
  };

  const { gpa, totalCredits } = useMemo(() => {
    let tCredits = 0;
    let earnedPoints = 0;
    courses.forEach((c) => {
      const credits = parseFloat(c.credits) || 0;
      tCredits += credits;
      earnedPoints += credits * (GRADE_POINTS[c.grade] || 0);
    });
    return {
      totalCredits: Math.round(tCredits * 10) / 10,
      gpa: tCredits > 0 ? (earnedPoints / tCredits).toFixed(2) : '0.00',
    };
  }, [courses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Course Input Column */}
      <div className="lg:col-span-8 space-y-3">
        <div className="pb-2 border-b border-border flex items-center justify-between">
          <span className="text-xs font-mono text-secondary">Course Code & Title</span>
          <span className="text-xs font-mono text-secondary mr-24 hidden sm:inline">Credits • Grade</span>
        </div>

        {courses.map((course) => (
          <div key={course.id} className="flex flex-wrap sm:flex-nowrap gap-2.5 items-end">
            <div className="grow min-w-[200px]">
              <CourseAutocomplete
                id={`course-${course.id}`}
                value={course.name}
                onChange={(val) => updateCourse(course.id, 'name', val)}
                onSelectCourse={(selected) => handleSelectCourse(course.id, selected)}
              />
            </div>
            <div className="w-24 shrink-0">
              <Input
                label="Credits"
                type="number"
                step="0.5"
                min="0.5"
                max="20"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
              />
            </div>
            <div className="w-24 shrink-0">
              <label className="block text-xs font-medium text-secondary mb-1.5">Grade</label>
              <select
                className="w-full h-9 px-2.5 rounded-theme-md border border-border bg-surface-raised text-on-surface text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
              >
                {Object.keys(GRADE_POINTS).map((g) => (
                  <option key={g} value={g}>
                    {g} ({GRADE_POINTS[g]} pts)
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => removeCourse(course.id)}
              disabled={courses.length <= 1}
              className="h-9 px-2 rounded-theme-md text-muted hover:text-danger hover:bg-danger-light disabled:opacity-30 transition-colors shrink-0 flex items-center justify-center border border-transparent"
              aria-label="Remove subject"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}

        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={addCourse}>
            + Add Another Subject
          </Button>
        </div>
      </div>

      {/* Summary Scorecard Column */}
      <div className="lg:col-span-4">
        <Card className="sticky top-20 text-center py-6 border border-border bg-surface-raised space-y-4">
          <div className="text-[11px] font-mono text-muted uppercase tracking-wider">
            Calculated Semester GPA
          </div>
          <div className="text-4xl font-semibold font-mono text-on-surface tracking-tight">
            {gpa}
          </div>
          <div className="pt-3 border-t border-border flex justify-around text-xs font-mono text-secondary">
            <div>
              <span className="block text-muted text-[10px]">Registered Credits</span>
              <span className="font-semibold text-on-surface">{totalCredits}</span>
            </div>
            <div>
              <span className="block text-muted text-[10px]">Scale</span>
              <span className="font-semibold text-on-surface">10.0</span>
            </div>
          </div>
          <p className="text-[10px] text-muted leading-relaxed font-sans px-2">
            Formula: ∑(Credits × Grade Points) / Total Registered Credits
          </p>
        </Card>
      </div>
    </div>
  );
}
