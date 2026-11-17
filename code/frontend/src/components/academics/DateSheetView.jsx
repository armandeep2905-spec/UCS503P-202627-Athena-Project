import Card from '../ui/Card';

export default function DateSheetView() {
  const exams = [
    { date: '2026-09-25', time: '09:00 AM - 12:00 PM', course: 'UCS503 - Software Engineering', venue: 'Main Auditorium' },
    { date: '2026-09-27', time: '02:00 PM - 05:00 PM', course: 'UCS501 - Computer Networks', venue: 'Block A, Room 101' },
    { date: '2026-09-29', time: '09:00 AM - 12:00 PM', course: 'UCS502 - Compiler Design', venue: 'Main Auditorium' },
    { date: '2026-10-01', time: '09:00 AM - 12:00 PM', course: 'UCS504 - Artificial Intelligence', venue: 'Block B, Hall 2' },
  ];

  return (
    <Card padding={false} className="overflow-hidden border border-border">
      <div className="p-4 border-b border-border bg-surface-alt/70 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-semibold text-on-surface">Mid-Semester Examination Schedule</h3>
          <p className="text-[11px] font-mono text-muted">Autumn 2026 Session • Controller of Examinations</p>
        </div>
        <a
          href="https://www.thapar.edu"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono text-primary hover:underline"
        >
          Official Notice PDF ↗
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[560px]">
          <thead className="bg-surface text-secondary font-mono border-b border-border">
            <tr>
              <th className="px-4 py-2.5 font-medium w-36">Exam Date</th>
              <th className="px-4 py-2.5 font-medium w-48">Time Slot</th>
              <th className="px-4 py-2.5 font-medium">Subject Code & Title</th>
              <th className="px-4 py-2.5 font-medium text-right">Venue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface-raised font-sans">
            {exams.map((exam, i) => (
              <tr key={i} className="hover:bg-surface-alt/40 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-on-surface">
                  {new Date(exam.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-4 py-3 font-mono text-secondary">{exam.time}</td>
                <td className="px-4 py-3 font-medium text-on-surface">{exam.course}</td>
                <td className="px-4 py-3 text-right font-mono text-secondary text-xs">{exam.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
