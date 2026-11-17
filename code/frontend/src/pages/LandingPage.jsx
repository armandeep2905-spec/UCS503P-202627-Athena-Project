import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function LandingPage() {
  return (
    <PageShell>
      <div className="py-8 sm:py-14 animate-fade-in space-y-16">
        {/* Asymmetric Split Editorial Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Scholarly Thesis & Entry */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-theme-sm border border-border bg-surface-raised text-secondary text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Official TIET Academic Portal • 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-on-surface tracking-tight leading-[1.14]">
              The authoritative digital companion for Thapar students.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-secondary leading-relaxed max-w-xl">
              Access verified course schemes, 474+ faculty contact directories, official academic regulations, and 2D campus navigation—grounded directly in institutional knowledge.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/select-institution">
                <Button size="lg" className="w-full sm:w-auto h-10 px-5">
                  Enter Campus Portal
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto h-10 px-5">
                  Sign in with College ID
                </Button>
              </Link>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted font-mono">
              <span>102 Core & Elective Courses</span>
              <span className="hidden sm:inline">•</span>
              <span>474 Faculty Records</span>
              <span className="hidden sm:inline">•</span>
              <span>Patiala Campus</span>
            </div>
          </div>

          {/* Right Column: Grounded Product Moment (Real Academic Ledger Preview) */}
          <div className="lg:col-span-5">
            <Card className="border border-border bg-surface-raised shadow-theme-md space-y-4 p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                  <span className="text-xs font-semibold text-on-surface uppercase tracking-wider font-mono">
                    Academic Registry Sample
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted">B.E. CSE • Sem III</span>
              </div>

              {/* Course Ledger Rows */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-theme-md bg-surface-alt/70 border border-border/60">
                  <div>
                    <span className="font-semibold text-on-surface">UCS301</span>
                    <p className="text-[11px] text-secondary font-sans">Data Structures & Algorithms</p>
                  </div>
                  <span className="text-[11px] text-muted">4.0 Cr</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-theme-md bg-surface-alt/70 border border-border/60">
                  <div>
                    <span className="font-semibold text-on-surface">UCS303</span>
                    <p className="text-[11px] text-secondary font-sans">Operating Systems Principles</p>
                  </div>
                  <span className="text-[11px] text-muted">4.0 Cr</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-theme-md bg-surface-alt/70 border border-border/60">
                  <div>
                    <span className="font-semibold text-on-surface">UTA018</span>
                    <p className="text-[11px] text-secondary font-sans">Object Oriented Programming</p>
                  </div>
                  <span className="text-[11px] text-muted">4.0 Cr</span>
                </div>
              </div>

              {/* Athena Assistant Prompt Simulation */}
              <div className="pt-2 border-t border-border">
                <div className="p-3 rounded-theme-md bg-surface border border-border text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-secondary font-medium">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Instant Query Resolution</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed font-sans">
                    "Dr. Neeraj Kumar, Professor & Head, Department of CSED: neeraj.kumar@thapar.edu"
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quiet Tri-Partite Pillars (Clean line icons, no pastel pills) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-border text-left">
          <div className="space-y-2.5">
            <div className="w-8 h-8 rounded-theme-sm bg-surface-alt border border-border flex items-center justify-center text-secondary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-on-surface">Curriculum & Directory</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Complete semester-wise course codes, syllabus links, credit schemes, and verified faculty email contacts.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-8 h-8 rounded-theme-sm bg-surface-alt border border-border flex items-center justify-center text-secondary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-on-surface">Patiala Campus Map</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Interactive walking and vehicle navigation between academic blocks, hostel residences, central library, and labs.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-8 h-8 rounded-theme-sm bg-surface-alt border border-border flex items-center justify-center text-secondary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-on-surface">Schedules & Societies</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Academic timetables, examination date sheets, student society notices, and personal academic reminders.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
