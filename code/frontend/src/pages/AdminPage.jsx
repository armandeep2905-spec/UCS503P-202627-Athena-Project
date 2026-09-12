import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function AdminPage() {
  return (
    <PageShell showBack={true} title="Knowledge Base Administration">
      <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-primary-light p-6 rounded-theme-xl border border-primary/20">
          <div>
            <h2 className="text-lg font-bold text-primary mb-1">Knowledge Base Management</h2>
            <p className="text-sm text-primary/80">Upload verified documents to improve Athena's answers.</p>
          </div>
          <Button>Upload Document</Button>
        </div>

        <Card padding={false} className="overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-alt">
            <h3 className="font-semibold text-on-surface">Ingested Documents</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Uploaded At</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* Stub data rows */}
                <tr className="hover:bg-surface-alt">
                  <td className="px-4 py-3 font-medium text-on-surface">Campus Facilities Guide 2026</td>
                  <td className="px-4 py-3 text-muted">PDF</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-success-light text-success">Active</span>
                  </td>
                  <td className="px-4 py-3 text-muted">Sep 01, 2026</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-danger hover:underline text-xs font-medium">Delete</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-alt">
                  <td className="px-4 py-3 font-medium text-on-surface">Hostel Rules & Regulations</td>
                  <td className="px-4 py-3 text-muted">PDF</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-success-light text-success">Active</span>
                  </td>
                  <td className="px-4 py-3 text-muted">Aug 28, 2026</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-danger hover:underline text-xs font-medium">Delete</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-alt">
                  <td className="px-4 py-3 font-medium text-on-surface">Updated Mid-Sem Date Sheet</td>
                  <td className="px-4 py-3 text-muted">Notice</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-warning-light text-warning">Processing</span>
                  </td>
                  <td className="px-4 py-3 text-muted">Just now</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-muted hover:underline text-xs font-medium cursor-not-allowed">Delete</button>
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
