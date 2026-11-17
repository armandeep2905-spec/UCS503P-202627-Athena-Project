import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function AdminPage() {
  return (
    <PageShell showBack={true} title="Institutional Document Registry">
      <div className="animate-fade-in max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-theme-lg border border-border bg-surface-raised shadow-theme-sm">
          <div>
            <h2 className="text-sm font-semibold text-on-surface mb-0.5">Knowledge Base Index Management</h2>
            <p className="text-xs text-secondary font-mono">Upload approved regulations, circulars, and course PDFs to refresh Athena's FTS5 index</p>
          </div>
          <Button size="sm">Upload Document PDF</Button>
        </div>

        <Card padding={false} className="overflow-hidden border border-border">
          <div className="p-4 border-b border-border bg-surface-alt/70">
            <h3 className="text-xs font-semibold text-on-surface">Ingested Institutional Documents</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[560px]">
              <thead className="bg-surface text-secondary font-mono border-b border-border">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Document Title</th>
                  <th className="px-4 py-2.5 font-medium w-24">Type</th>
                  <th className="px-4 py-2.5 font-medium w-28">Index Status</th>
                  <th className="px-4 py-2.5 font-medium w-32">Timestamp</th>
                  <th className="px-4 py-2.5 font-medium text-right w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface-raised font-sans">
                <tr className="hover:bg-surface-alt/30">
                  <td className="px-4 py-3 font-medium text-on-surface">TIET Academic Regulations (March 2026)</td>
                  <td className="px-4 py-3 font-mono text-muted text-xs">PDF</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-theme-sm text-[11px] font-mono bg-surface-alt text-secondary border border-border">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Indexed
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted text-[11px]">2026-09-01</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-danger hover:underline text-xs font-mono">Remove</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-alt/30">
                  <td className="px-4 py-3 font-medium text-on-surface">B.E. Computer Science Course Scheme 2024-2028</td>
                  <td className="px-4 py-3 font-mono text-muted text-xs">PDF</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-theme-sm text-[11px] font-mono bg-surface-alt text-secondary border border-border">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Indexed
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted text-[11px]">2026-08-28</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-danger hover:underline text-xs font-mono">Remove</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-alt/30">
                  <td className="px-4 py-3 font-medium text-on-surface">Mid-Semester Examination Schedule Notice</td>
                  <td className="px-4 py-3 font-mono text-muted text-xs">Notice</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-theme-sm text-[11px] font-mono bg-surface-alt text-secondary border border-border">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                      Processing
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted text-[11px]">Just now</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-muted text-xs font-mono cursor-not-allowed">Remove</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
