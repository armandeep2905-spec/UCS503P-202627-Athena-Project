import { useState } from 'react';
import PageShell from '../components/layout/PageShell';
import NavTile from '../components/dashboard/NavTile';
import ReminderCard from '../components/dashboard/ReminderCard';
import DateCard from '../components/dashboard/DateCard';
import AddReminderModal from '../components/dashboard/AddReminderModal';
import Loader from '../components/ui/Loader';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import { getReminders, createReminder } from '../api/reminders';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: reminders, loading, setData: setReminders } = useFetch(getReminders);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddReminder = async (newReminder) => {
    const res = await createReminder(newReminder);
    if (res.data) {
      // Optimitic/local update since we know the mock structure
      setReminders(prev => [res.data, ...(prev || [])]);
    }
  };

  const dates = [
    { date: '2026-09-25', title: 'Mid-Semester Exams Begin', description: 'Check academics for date sheet' },
    { date: '2026-10-15', title: 'Fee Submission Last Date', description: 'For odd semester 2026-27' },
  ];

  return (
    <PageShell>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Welcome Section */}
        <section>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Student'}</h1>
          <p className="text-muted">Here's what's happening on campus today.</p>
        </section>

        {/* Navigation Hub */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NavTile
            to="/academics"
            title="Academics"
            description="Timetable, courses, faculty, and CGPA calculator"
            color="primary"
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5" />
              </svg>
            }
          />
          <NavTile
            to="/societies-events"
            title="Societies & Events"
            description="Discover clubs, fests, and upcoming activities"
            color="accent"
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </section>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reminders */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-on-surface">Your Reminders</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>

            {loading ? (
              <Loader />
            ) : reminders && reminders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
                {reminders.slice(0, 4).map(r => (
                  <ReminderCard key={r.id} reminder={r} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-border rounded-theme-lg bg-surface-alt">
                <p className="text-sm text-muted">No upcoming reminders.</p>
              </div>
            )}
          </section>

          {/* Important Dates */}
          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Important Dates</h2>
            <div className="space-y-4">
              {dates.map((d, i) => (
                <div key={i} className="p-4 rounded-theme-lg border border-border bg-surface-raised shadow-theme-sm">
                  <DateCard date={d.date} title={d.title} description={d.description} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <AddReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddReminder}
      />
    </PageShell>
  );
}
