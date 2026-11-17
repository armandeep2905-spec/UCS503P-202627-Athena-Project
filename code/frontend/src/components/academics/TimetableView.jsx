import Card from '../ui/Card';

export default function TimetableView() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  return (
    <Card padding={false} className="overflow-hidden border border-border">
      <div className="p-4 border-b border-border bg-surface-alt/70 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-semibold text-on-surface">Weekly Lecture & Lab Matrix</h3>
          <p className="text-[11px] font-mono text-muted">B.E. Computer Science & Engineering • Autumn 2026</p>
        </div>
        <span className="text-[11px] font-mono text-secondary">
          75% Attendance Required
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className="bg-surface text-secondary font-mono border-b border-border">
            <tr>
              <th className="px-3.5 py-2.5 font-medium w-28">Slot</th>
              {days.map((day) => (
                <th key={day} className="px-3.5 py-2.5 font-medium">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface-raised font-sans">
            {times.map((time, idx) => (
              <tr key={time} className="hover:bg-surface-alt/20 transition-colors">
                <td className="px-3.5 py-3 font-mono text-[11px] text-muted border-r border-border bg-surface/50">
                  {time}
                </td>
                {days.map((day) => {
                  const hasClass = (idx + day.length) % 3 === 0;
                  return (
                    <td key={`${day}-${time}`} className="px-2 py-2 border-r border-border last:border-r-0 align-top">
                      {hasClass ? (
                        <div className="bg-surface-alt/80 border border-border rounded-theme-sm p-2 space-y-0.5">
                          <div className="font-mono font-semibold text-primary text-[11px]">UCS301</div>
                          <div className="text-[10px] text-on-surface truncate">Data Structures</div>
                          <div className="text-[10px] font-mono text-muted truncate">LP-104 • CSED</div>
                        </div>
                      ) : (
                        <div className="h-10 text-center text-muted/20 text-xs flex items-center justify-center">
                          —
                        </div>
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
