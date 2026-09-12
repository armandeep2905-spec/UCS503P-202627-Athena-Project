import Card from '../ui/Card';

export default function DateSheetView() {
  // Placeholder data
  const exams = [
    { date: '2026-09-25', time: '09:00 AM - 12:00 PM', course: 'UCS503 - Software Engineering', venue: 'Main Hall' },
    { date: '2026-09-27', time: '02:00 PM - 05:00 PM', course: 'UCS501 - Computer Networks', venue: 'Block A, Room 101' },
    { date: '2026-09-29', time: '09:00 AM - 12:00 PM', course: 'UCS502 - Compiler Design', venue: 'Main Hall' },
    { date: '2026-10-01', time: '09:00 AM - 12:00 PM', course: 'UCS504 - Artificial Intelligence', venue: 'Main Hall' },
  ];

  return (
    <Card padding={false} className="overflow-hidden">
      <div className="p-4 border-b border-border bg-surface-alt flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-on-surface">Mid-Semester Examination Date Sheet</h3>
          <p className="text-xs text-muted">September - October 2026</p>
        </div>
        <button className="text-sm text-primary font-medium hover:underline">Download PDF</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Venue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {exams.map((exam, i) => (
              <tr key={i} className="hover:bg-surface-alt transition-colors">
                <td className="px-4 py-3 font-medium text-on-surface">
                  {new Date(exam.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-4 py-3 text-muted">{exam.time}</td>
                <td className="px-4 py-3 font-medium text-primary">{exam.course}</td>
                <td className="px-4 py-3 text-muted">{exam.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
