'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TypeaheadOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface TypeaheadInputProps {
  options: TypeaheadOption[];
  value: string;
  displayValue: string;
  onChange: (value: string, displayValue: string) => void;
  onCreateNew?: () => void;
  placeholder?: string;
  createNewLabel?: string;
  required?: boolean;
  className?: string;
}

export function TypeaheadInput({
  options,
  value,
  displayValue,
  onChange,
  onCreateNew,
  placeholder,
  createNewLabel = 'Create new',
  required,
  className,
}: TypeaheadInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = query.trim()
    ? options.filter(o =>
        o.label.toLowerCase().includes(query.toLowerCase()) ||
        (o.sublabel && o.sublabel.toLowerCase().includes(query.toLowerCase()))
      )
    : options;

  const hasExactMatch = options.some(o => o.label.toLowerCase() === query.trim().toLowerCase());

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightedIndex]) {
        (items[highlightedIndex] as HTMLElement).scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const selectOption = useCallback((option: TypeaheadOption) => {
    onChange(option.id, option.label);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    setHighlightedIndex(-1);
    // Clear selection when typing
    if (value) {
      onChange('', '');
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    setQuery('');
  };

  const totalItems = filtered.length + (onCreateNew && !hasExactMatch && query.trim() ? 1 : 0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
          selectOption(filtered[highlightedIndex]);
        } else if (highlightedIndex === filtered.length && onCreateNew) {
          setIsOpen(false);
          onCreateNew();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    onChange('', '');
    setQuery('');
    inputRef.current?.focus();
  };

  const showingValue = value ? displayValue : query;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={showingValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
            'placeholder:text-muted',
          )}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-0.5"
            tabIndex={-1}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {/* Hidden input for form validation */}
      {required && (
        <input
          type="text"
          value={value}
          required
          tabIndex={-1}
          className="sr-only"
          aria-hidden="true"
          onChange={() => {}}
        />
      )}
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg"
          role="listbox"
        >
          {filtered.length === 0 && !onCreateNew && (
            <li className="px-3 py-2 text-sm text-muted">No results found</li>
          )}
          {filtered.map((option, idx) => (
            <li
              key={option.id}
              role="option"
              aria-selected={option.id === value}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer transition-colors',
                idx === highlightedIndex && 'bg-primary/10',
                option.id === value && 'font-medium text-primary',
                idx !== highlightedIndex && option.id !== value && 'hover:bg-surface-hover',
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(option);
              }}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              <span>{option.label}</span>
              {option.sublabel && (
                <span className="ml-2 text-xs text-muted">{option.sublabel}</span>
              )}
            </li>
          ))}
          {onCreateNew && !hasExactMatch && query.trim() && (
            <li
              role="option"
              aria-selected={false}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer border-t border-border flex items-center gap-2 text-primary font-medium transition-colors',
                highlightedIndex === filtered.length && 'bg-primary/10',
                highlightedIndex !== filtered.length && 'hover:bg-surface-hover',
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsOpen(false);
                onCreateNew();
              }}
              onMouseEnter={() => setHighlightedIndex(filtered.length)}
            >
              <Plus className="w-4 h-4" />
              {createNewLabel}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
