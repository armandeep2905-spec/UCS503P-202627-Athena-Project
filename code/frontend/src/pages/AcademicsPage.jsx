import { useState } from 'react';
import PageShell from '../components/layout/PageShell';
import CourseTable from '../components/academics/CourseTable';
import FacultyDirectory from '../components/academics/FacultyDirectory';
import TimetableView from '../components/academics/TimetableView';
import DateSheetView from '../components/academics/DateSheetView';
import CGPACalculator from '../components/academics/CGPACalculator';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { getCourses } from '../api/courses';
import { getFaculty } from '../api/faculty';

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState('courses');

  const { data: courses, loading: coursesLoading, error: coursesError } = useFetch(getCourses);
  const { data: faculty, loading: facultyLoading, error: facultyError } = useFetch(getFaculty);

  const tabs = [
    { id: 'courses', label: 'Curriculum & Syllabi' },
    { id: 'faculty', label: 'Faculty Directory' },
    { id: 'timetable', label: 'Semester Timetable' },
    { id: 'datesheet', label: 'Examination Schedule' },
    { id: 'cgpa', label: 'CGPA Calculator' },
  ];

  return (
    <PageShell showBack={true} title="Academic Registry">
      <div className="animate-fade-in pb-10 space-y-6">
        {/* Tab Navigation Bar */}
        <div className="flex overflow-x-auto border-b border-border hide-scrollbar gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-2.5 px-3.5 text-xs font-mono transition-colors border-b-2
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-secondary hover:text-on-surface hover:border-border'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Canvas */}
        <div className="min-h-[420px]">
          {activeTab === 'courses' && (
            <div>
              {coursesLoading ? (
                <Loader />
              ) : coursesError ? (
                <ErrorState />
              ) : (
                <CourseTable courses={courses} />
              )}
            </div>
          )}

          {activeTab === 'faculty' && (
            <div>
              {facultyLoading ? (
                <Loader />
              ) : facultyError ? (
                <ErrorState />
              ) : (
                <FacultyDirectory facultyList={faculty} />
              )}
            </div>
          )}

          {activeTab === 'timetable' && <TimetableView />}

          {activeTab === 'datesheet' && <DateSheetView />}

          {activeTab === 'cgpa' && <CGPACalculator />}
        </div>
      </div>
    </PageShell>
  );
}
