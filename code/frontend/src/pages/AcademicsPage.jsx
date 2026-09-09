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
    { id: 'courses', label: 'Courses & Syllabi' },
    { id: 'faculty', label: 'Faculty Directory' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'datesheet', label: 'Date Sheet' },
    { id: 'cgpa', label: 'CGPA Calculator' },
  ];

  return (
    <PageShell showBack={true} title="Academics">
      <div className="animate-fade-in pb-12">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-border mb-6 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-3 px-4 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-on-surface hover:border-border'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'courses' && (
            <div>
              {coursesLoading ? <Loader /> : coursesError ? <ErrorState /> : <CourseTable courses={courses} />}
            </div>
          )}

          {activeTab === 'faculty' && (
            <div>
              {facultyLoading ? <Loader /> : facultyError ? <ErrorState /> : <FacultyDirectory facultyList={faculty} />}
            </div>
          )}

          {activeTab === 'timetable' && (
            <TimetableView />
          )}

          {activeTab === 'datesheet' && (
            <DateSheetView />
          )}

          {activeTab === 'cgpa' && (
            <CGPACalculator />
          )}
        </div>
      </div>
    </PageShell>
  );
}
