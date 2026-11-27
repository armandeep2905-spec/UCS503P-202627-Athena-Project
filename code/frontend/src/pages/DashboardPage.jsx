import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import NavTile from '../components/dashboard/NavTile';
import ReminderCard from '../components/dashboard/ReminderCard';
import DateCard from '../components/dashboard/DateCard';
import AddReminderModal from '../components/dashboard/AddReminderModal';
import SettingsModal from '../components/dashboard/SettingsModal';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import { getReminders, createReminder, deleteReminder } from '../api/reminders';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: reminders, loading, setData: setReminders } = useFetch(getReminders);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Time-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const studentName = user?.name || 'Student';
  const rollNumber = user?.rollNumber || user?.roll_number || null;
  const userBranch = localStorage.getItem('athena_branch') || user?.department || 'CSED';

  const handleAddReminder = async (newReminder) => {
    const res = await createReminder(newReminder);
    if (res.data) {
      setReminders((prev) => [res.data, ...(prev || [])]);
    }
  };

  const handleDeleteReminder = async (id) => {
    const res = await deleteReminder(id);
    if (!res.error) {
      setReminders((prev) => (prev || []).filter((r) => r.id !== id));
    }
  };

  const dates = [
    {
      date: '2026-09-25',
      title: 'Mid-Semester Examinations Begin',
      description: 'Consult academics portal for branch-wise date sheet & seating plans',
    },
    {
      date: '2026-10-15',
      title: 'Semester Fee Submission Deadline',
      description: 'Webkiosk portal clearance required for end-semester registration',
    },
    {
      date: '2026-11-20',
      title: 'Capstone & Project Interim Evaluations',
      description: 'Submission of preliminary project documentation to faculty guides',
    },
  ];

  const reminderCount = reminders ? reminders.length : 0;

  return (
    <PageShell>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Personalized Student Greeting & Metadata Header */}
        <section className="p-6 rounded-theme-xl border border-border bg-surface-raised shadow-theme-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-theme-sm text-[11px] font-mono bg-surface-alt text-secondary border border-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Verified Student Profile
                </span>
                <span className="px-2 py-0.5 rounded-theme-sm text-[11px] font-mono bg-surface-alt text-primary border border-border font-medium">
                  {userBranch} Department
                </span>
                {rollNumber ? (
                  <span className="px-2 py-0.5 rounded-theme-sm text-[11px] font-mono bg-surface-alt text-muted border border-border">
                    Roll: {rollNumber}
                  </span>
                ) : (
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="text-[11px] font-mono text-primary hover:underline"
                  >
                    + Add Roll No
                  </button>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-on-surface">
                {greeting}, {studentName}
              </h1>

              <p className="text-xs text-secondary font-mono leading-relaxed max-w-2xl">
                Thapar Institute of Engineering & Technology • Academic Session 2026-27 • Patiala Campus
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <button
                onClick={() => setIsReminderModalOpen(true)}
                className="px-3.5 py-2 text-xs font-medium rounded-theme-md bg-primary text-on-primary hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-theme-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Reminder</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-border">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono text-muted uppercase">My Reminders</span>
              <p className="text-base font-semibold text-on-surface font-mono">
                {loading ? '...' : `${reminderCount} Active`}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono text-muted uppercase">Curriculum</span>
              <p className="text-base font-semibold text-on-surface font-mono">102 Courses</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono text-muted uppercase">Faculty Directory</span>
              <p className="text-base font-semibold text-on-surface font-mono">474+ Profiles</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono text-muted uppercase">Academic Focus</span>
              <p className="text-base font-semibold text-primary font-mono">{userBranch}</p>
            </div>
          </div>
        </section>

        {/* Primary Navigation Hub */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-on-surface">Campus Navigation & Portals</h2>
            <span className="text-xs font-mono text-muted">Direct Access</span>
          </div>

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
              title="Campus Map & Routes"
              description="Walking and vehicle routes between lecture halls, labs, and blocks"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
            />
            <NavTile
              to="/societies-events"
              title="Societies & Notices"
              description="Technical chapters, cultural societies, fests, and circulars"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Personalized Reminders & Official Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account-Specific Academic Reminders */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-on-surface">Your Account Reminders</h2>
                <p className="text-[11px] text-muted font-mono">
                  Stored securely for {user?.email}
                </p>
              </div>
              <button
                onClick={() => setIsReminderModalOpen(true)}
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Reminder</span>
              </button>
            </div>

            {loading ? (
              <div className="p-8 flex justify-center border border-border rounded-theme-lg bg-surface-raised">
                <Loader />
              </div>
            ) : reminders && reminders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reminders.map((r) => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onDelete={handleDeleteReminder}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-border rounded-theme-lg bg-surface-alt/40 space-y-2">
                <div className="w-8 h-8 rounded-full bg-surface-raised border border-border mx-auto flex items-center justify-center text-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-on-surface">No pending reminders</p>
                <p className="text-[11px] text-muted max-w-xs mx-auto leading-relaxed">
                  Track assignments, exam dates, or lab evaluations tied directly to your account.
                </p>
                <div className="pt-1">
                  <Button size="sm" variant="outline" onClick={() => setIsReminderModalOpen(true)}>
                    + Create First Reminder
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Official TIET Calendar Deadlines */}
          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-on-surface">Official Academic Deadlines</h2>
              <p className="text-[11px] text-muted font-mono">
                Office of the Dean of Academic Affairs (DoAA)
              </p>
            </div>

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
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onAdd={handleAddReminder}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </PageShell>
  );
}
