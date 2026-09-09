export default function CitationChip({ source }) {
  const typeIcons = {
    PDF: '📄',
    Notice: '📌',
    Circular: '📋',
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-info-light text-info text-xs font-medium border border-info/20">
      <span>{typeIcons[source.type] || '📄'}</span>
      <span className="truncate max-w-[140px]">{source.title}</span>
    </span>
  );
}
