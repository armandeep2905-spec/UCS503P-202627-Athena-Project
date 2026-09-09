import Card from '../ui/Card';

export default function CourseTable({ courses }) {
  if (!courses || courses.length === 0) {
    return <p className="text-sm text-muted">No courses found.</p>;
  }

  return (
    <Card padding={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-alt border-b border-border text-on-surface">
            <tr>
              <th className="px-4 py-3 font-semibold">Code</th>
              <th className="px-4 py-3 font-semibold">Course Name</th>
              <th className="px-4 py-3 font-semibold">Faculty</th>
              <th className="px-4 py-3 font-semibold">Credits</th>
              <th className="px-4 py-3 font-semibold">Syllabus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-surface-alt/50 transition-colors">
                <td className="px-4 py-3 font-medium text-primary">{course.code}</td>
                <td className="px-4 py-3 text-on-surface">{course.name}</td>
                <td className="px-4 py-3 text-muted">{course.faculty}</td>
                <td className="px-4 py-3 text-muted">{course.credits}</td>
                <td className="px-4 py-3">
                  <a
                    href={course.syllabusLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
