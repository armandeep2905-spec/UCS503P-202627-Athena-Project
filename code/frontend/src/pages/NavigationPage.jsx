import { useLocation } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';

/**
 * Campus Navigation — hosts the standalone route finder
 * (public/campus-nav/map.html) inside the app shell.
 * Query params (?to=Library&from=Main%20Entrance&mode=vehicle) are passed
 * through, so other parts of Athena can deep-link to a route.
 */
export default function NavigationPage() {
  const { search } = useLocation();

  return (
    <PageShell showBack={true} title="Campus Navigation">
      <div className="animate-fade-in pb-6">
        <iframe
          key={search}
          src={`/campus-nav/map.html${search}`}
          title="Campus Navigation"
          className="w-full rounded-theme-xl border border-border bg-surface"
          style={{ height: 'calc(100vh - 7rem)', minHeight: 560 }}
        />
      </div>
    </PageShell>
  );
}
