import { useState, useRef, useEffect } from 'react';
import { THAPAR_CSE_COURSES } from '../../data/courses';

export default function CourseAutocomplete({
  value = '',
  onChange,
  onSelectCourse,
  placeholder = 'Search code or name (e.g. UCS301, Data Structures)...',
  id
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Filter courses based on user query matching subject code or subject name
  const filteredCourses = (() => {
    const trimmed = (value || '').trim().toLowerCase();
    if (!trimmed) return [];

    return THAPAR_CSE_COURSES.filter(course => {
      const codeMatch = course.code.toLowerCase().includes(trimmed);
      const nameMatch = course.name.toLowerCase().includes(trimmed);
      return codeMatch || nameMatch;
    }).slice(0, 10); // limit to top 10 matches for clean dropdown
  })();

  // Close dropdown on outside click
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
    // Fill course name/code display
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

  // Scroll active item into view
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
      <label htmlFor={id} className="block text-sm font-medium text-on-surface mb-1.5">
        Course Code / Name
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        className="w-full px-3.5 py-2.5 rounded-theme-md border border-border bg-surface text-on-surface placeholder:text-muted text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
          className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-theme-md bg-surface border border-border shadow-xl py-1 text-sm"
        >
          {filteredCourses.map((course, idx) => {
            const isSelected = idx === highlightedIndex;
            return (
              <li
                key={`${course.code}-${idx}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur before selection
                  handleSelect(course);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                  isSelected ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-elevated'
                }`}
              >
                <div className="flex flex-col text-left overflow-hidden pr-2">
                  <div className="font-medium truncate">
                    <span className="font-semibold text-primary mr-1.5">{course.code}</span>
                    <span>— {course.name}</span>
                  </div>
                  <span className="text-xs text-muted truncate">{course.semester}</span>
                </div>
                <div className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded bg-surface-elevated border border-border text-primary">
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
