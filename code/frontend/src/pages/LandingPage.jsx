import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';

export default function LandingPage() {
  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center max-w-3xl mx-auto py-12 animate-fade-in">
        <div className="w-20 h-20 bg-primary text-on-primary rounded-theme-xl flex items-center justify-center mb-8 shadow-theme-lg transform transition-transform hover:scale-105">
          <span className="text-4xl font-bold">A</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-on-surface tracking-tight mb-6">
          Your Intelligent Gateway <br className="hidden sm:block" />
          <span className="text-primary">to Campus.</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted mb-10 max-w-2xl leading-relaxed">
          Ask questions naturally, navigate campus buildings, and stay updated with your academic schedule—all powered by verified institutional knowledge.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/select-institution" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">
              Get Started
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full">
              I already have an account
            </Button>
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full border-t border-border pt-12">
          <div>
            <div className="w-10 h-10 rounded bg-primary-light text-primary flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Ask Anything</h3>
            <p className="text-sm text-muted">Get instant, reliable answers based on verified college documents and notices.</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded bg-accent-light text-accent flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Navigate Campus</h3>
            <p className="text-sm text-muted">Find classrooms, labs, and faculty offices easily with our interactive campus map.</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded bg-success-light text-success flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Stay Updated</h3>
            <p className="text-sm text-muted">Keep track of your timetable, upcoming exams, events, and personal reminders.</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
