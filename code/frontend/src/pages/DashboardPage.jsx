import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: reminders, loading, setData: setReminders } = useFetch(getReminders);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddReminder = async (newReminder) => {
    const res = await createReminder(newReminder);
    if (res.data) {
      setReminders((prev) => [res.data, ...(prev || [])]);
    }
  };

  const dates = [
    { date: '2026-09-25', title: 'Mid-Semester Examinations Begin', description: 'Consult academics portal for date sheet' },
    { date: '2026-10-15', title: 'Semester Fee Submission Deadline', description: 'For academic session 2026-27' },
  ];

  return (
    <PageShell>
      <div className="space-y-8 animate-fade-in pb-10">
        {/* Header Section */}
        <section className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 pb-4 border-b border-border">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-on-surface">
              Campus Overview
            </h1>
            <p className="text-xs text-secondary mt-1 font-mono">
              Academic Session 2026-27 • Thapar Institute of Engineering & Technology
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted">
              {user?.name ? `${user.name} (Student)` : 'TIET Patiala'}
            </span>
          </div>
        </section>

        {/* Primary Navigation Hub */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NavTile
              to="/academics"
              title="Academics & Faculty"
              description="Courses, syllabi, 474+ faculty directory, and CGPA calculator"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5" />
                </svg>
              }
            />
            <NavTile
              to="/navigation"
              title="Campus Navigation"
              description="Find walking and vehicle routes between buildings and labs"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
            />
            <NavTile
              to="/societies-events"
              title="Societies & Notices"
              description="Student clubs, fests, and official campus notices"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Schedule & Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reminders Ledger */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-on-surface">Your Academic Reminders</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Reminder</span>
              </button>
            </div>

            {loading ? (
              <Loader />
            ) : reminders && reminders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reminders.slice(0, 4).map((r) => (
                  <ReminderCard key={r.id} reminder={r} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-border rounded-theme-lg bg-surface-alt/50">
                <p className="text-xs text-muted">No pending reminders scheduled.</p>
              </div>
            )}
          </section>

          {/* Academic Deadlines & Dates */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-on-surface">Official Calendar Deadlines</h2>
            <div className="space-y-2.5">
              {dates.map((d, i) => (
                <div key={i} className="p-3.5 rounded-theme-lg border border-border bg-surface-raised shadow-theme-sm">
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
