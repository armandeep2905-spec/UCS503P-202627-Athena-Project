import PageShell from '../components/layout/PageShell';
import SocietyCard from '../components/societies/SocietyCard';
import EventCard from '../components/societies/EventCard';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { getSocieties } from '../api/societies';
import { getEvents } from '../api/events';

export default function SocietiesEventsPage() {
  const { data: rawSocieties, loading: socLoading, error: socError } = useFetch(getSocieties);
  const { data: rawEvents, loading: evtLoading, error: evtError } = useFetch(getEvents);

  const events = Array.isArray(rawEvents)
    ? rawEvents
    : Array.isArray(rawEvents?.results)
    ? rawEvents.results
    : [];

  const societies = Array.isArray(rawSocieties)
    ? rawSocieties
    : Array.isArray(rawSocieties?.results)
    ? rawSocieties.results
    : [];

  return (
    <PageShell showBack={true} title="Campus Life & Notices">
      <div className="space-y-10 animate-fade-in pb-10">
        {/* Upcoming Events Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-on-surface">Scheduled Events & Workshops</h2>
              <p className="text-xs text-secondary mt-0.5 font-mono">Official TIET academic seminars, cultural fests, and hackathons</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-theme-sm text-xs font-mono bg-surface-alt text-secondary border border-border">
              {events?.length || 0} Events
            </span>
          </div>

          {evtLoading ? (
            <Loader />
          ) : evtError ? (
            <ErrorState />
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              {events.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted">No upcoming campus events currently listed.</p>
          )}
        </section>

        {/* Societies Section */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-border">
            <h2 className="text-base font-semibold text-on-surface">Student Societies & Technical Chapters</h2>
            <p className="text-xs text-secondary mt-0.5 font-mono">Recognized student societies, ACM/IEEE branches, and campus cultural clubs</p>
          </div>

          {socLoading ? (
            <Loader />
          ) : socError ? (
            <ErrorState />
          ) : societies && societies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {societies.map((soc) => (
                <SocietyCard key={soc.id} society={soc} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted">No societies registered in database.</p>
          )}
        </section>
      </div>
    </PageShell>
  );
}
