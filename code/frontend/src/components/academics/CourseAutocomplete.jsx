import { useState, useRef, useEffect } from 'react';
import { THAPAR_CSE_COURSES } from '../../data/courses';

export default function CourseAutocomplete({
  value = '',
  onChange,
  onSelectCourse,
  placeholder = 'Search code or title (e.g. UCS301, Data Structures)...',
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const filteredCourses = (() => {
    const trimmed = (value || '').trim().toLowerCase();
    if (!trimmed) return [];

    return THAPAR_CSE_COURSES.filter((course) => {
      const codeMatch = course.code.toLowerCase().includes(trimmed);
      const nameMatch = course.name.toLowerCase().includes(trimmed);
      return codeMatch || nameMatch;
    }).slice(0, 10);
  })();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (course) => {
    const displayName = `${course.code} — ${course.name}`;
    onChange(displayName);
    if (onSelectCourse) {
      onSelectCourse(course);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filteredCourses.length === 0) {
      if (e.key === 'ArrowDown' && filteredCourses.length > 0) {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredCourses.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredCourses.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < filteredCourses.length) {
        e.preventDefault();
        handleSelect(filteredCourses[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <label htmlFor={id} className="block text-xs font-medium text-secondary mb-1.5">
        Subject Title or Code
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        className="w-full h-9 px-3 py-2 rounded-theme-md border border-border bg-surface-raised text-on-surface placeholder:text-muted text-sm transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if ((value || '').trim()) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
      />

      {isOpen && filteredCourses.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-theme-md bg-surface-raised border border-border shadow-theme-lg py-1 text-xs font-sans"
        >
          {filteredCourses.map((course, idx) => {
            const isSelected = idx === highlightedIndex;
            return (
              <li
                key={`${course.code}-${idx}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(course);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                  isSelected ? 'bg-surface-alt text-on-surface font-medium' : 'text-on-surface hover:bg-surface-alt/60'
                }`}
              >
                <div className="flex flex-col text-left overflow-hidden pr-2">
                  <div className="truncate">
                    <span className="font-mono font-semibold text-primary mr-1.5">{course.code}</span>
                    <span>{course.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted truncate">{course.semester}</span>
                </div>
                <div className="shrink-0 font-mono text-[11px] px-1.5 py-0.5 rounded-theme-sm bg-surface-alt border border-border text-secondary">
                  {course.credits} Cr
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
