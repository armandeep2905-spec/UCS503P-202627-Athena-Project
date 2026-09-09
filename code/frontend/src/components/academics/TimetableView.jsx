import Card from '../ui/Card';

export default function TimetableView() {
  // Placeholder data for Timetable
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  // A very basic stub representation
  return (
    <Card padding={false} className="overflow-hidden">
      <div className="p-4 border-b border-border bg-surface-alt">
        <h3 className="text-sm font-semibold text-on-surface">Weekly Timetable</h3>
        <p className="text-xs text-muted">Current Semester</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[800px]">
          <thead className="bg-surface border-b border-border text-muted">
            <tr>
              <th className="px-3 py-2 font-medium w-24">Time</th>
              {days.map(day => (
                <th key={day} className="px-3 py-2 font-medium">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {times.map((time, idx) => (
              <tr key={time}>
                <td className="px-3 py-4 font-medium text-muted border-r border-border">{time}</td>
                {days.map(day => {
                  // Mock some populated cells
                  const hasClass = (idx + day.length) % 3 === 0;
                  return (
                    <td key={`${day}-${time}`} className="px-2 py-2 border-r border-border last:border-r-0">
                      {hasClass ? (
                        <div className="bg-primary-light border border-primary/20 rounded p-1.5">
                          <div className="font-semibold text-primary text-[11px]">UCS503</div>
                          <div className="text-[10px] text-muted truncate">Dr. Priya Sharma</div>
                          <div className="text-[10px] text-muted truncate">Room 204</div>
                        </div>
                      ) : (
                        <div className="text-transparent">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
