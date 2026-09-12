import PageShell from '../components/layout/PageShell';
import SocietyCard from '../components/societies/SocietyCard';
import EventCard from '../components/societies/EventCard';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/ui/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { getSocieties } from '../api/societies';
import { getEvents } from '../api/events';

export default function SocietiesEventsPage() {
  const { data: societies, loading: socLoading, error: socError } = useFetch(getSocieties);
  const { data: events, loading: evtLoading, error: evtError } = useFetch(getEvents);

  return (
    <PageShell showBack={true} title="Societies & Events">
      <div className="space-y-12 animate-fade-in pb-12">

        {/* Upcoming Events Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-on-surface">Upcoming Events</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-light text-accent">
              {events?.length || 0} Events
            </span>
          </div>

          {evtLoading ? (
            <Loader />
          ) : evtError ? (
            <ErrorState />
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {events.map(evt => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No upcoming events scheduled.</p>
          )}
        </section>

        {/* Societies Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-on-surface mb-2">Campus Societies</h2>
            <p className="text-muted">Join a club, explore your interests, and build your network.</p>
          </div>

          {socLoading ? (
            <Loader />
          ) : socError ? (
            <ErrorState />
          ) : societies && societies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {societies.map(soc => (
                <SocietyCard key={soc.id} society={soc} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No societies found.</p>
          )}
        </section>

      </div>
    </PageShell>
  );
}
