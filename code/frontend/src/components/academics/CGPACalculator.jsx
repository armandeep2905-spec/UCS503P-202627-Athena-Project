import { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const GRADE_POINTS = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0
};

export default function CGPACalculator() {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Course 1', credits: 4, grade: 'A' },
    { id: 2, name: 'Course 2', credits: 4, grade: 'B+' },
    { id: 3, name: 'Course 3', credits: 3, grade: 'A+' },
  ]);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: `Course ${courses.length + 1}`, credits: 3, grade: 'A' }]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const { gpa, totalCredits } = useMemo(() => {
    let tCredits = 0;
    let earnedPoints = 0;
    courses.forEach(c => {
      const credits = parseFloat(c.credits) || 0;
      tCredits += credits;
      earnedPoints += credits * (GRADE_POINTS[c.grade] || 0);
    });
    return {
      totalCredits: tCredits,
      gpa: tCredits > 0 ? (earnedPoints / tCredits).toFixed(2) : '0.00'
    };
  }, [courses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="flex flex-wrap sm:flex-nowrap gap-3 items-end">
            <div className="grow">
              <Input
                label="Course Name"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
              />
            </div>
            <div className="w-24">
              <Input
                label="Credits"
                type="number"
                min="1"
                max="10"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-on-surface mb-1.5">Grade</label>
              <select
                className="w-full px-3 py-2.5 rounded-theme-md border border-border bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
              >
                {Object.keys(GRADE_POINTS).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => removeCourse(course.id)}
              disabled={courses.length <= 1}
              className="mb-1.5 p-2 rounded-theme-md text-muted hover:text-danger hover:bg-danger-light disabled:opacity-50 transition-colors"
              aria-label="Remove course"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={addCourse}>
          + Add Another Course
        </Button>
      </div>

      <div>
        <Card className="sticky top-20 text-center py-8">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-2">Semester GPA</h3>
          <div className="text-5xl font-bold text-primary mb-4">{gpa}</div>
          <div className="text-sm text-muted">Total Credits: {totalCredits}</div>
        </Card>
      </div>
    </div>
  );
}
