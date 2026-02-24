'use client';

import { CreditCard, Package, Search, TicketCheck, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { Input } from '@/components/ui/input';
import {
  globalSearch,
  type SearchResult,
  type SearchResultType,
} from '@/features/search/actions/global-search';

const typeIcons: Record<SearchResultType, typeof User> = {
  user: User,
  product: Package,
  ticket: TicketCheck,
  subscription: CreditCard,
};

const typeLabels: Record<SearchResultType, string> = {
  user: 'User',
  product: 'Product',
  ticket: 'Ticket',
  subscription: 'Subscription',
};

const typeColors: Record<SearchResultType, string> = {
  user: 'bg-blue-100 text-blue-700',
  product: 'bg-violet-100 text-violet-700',
  ticket: 'bg-amber-100 text-amber-700',
  subscription: 'bg-emerald-100 text-emerald-700',
};

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Debounced search
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setSelectedIndex(0);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length < 2) {
        setResults([]);
        return;
      }

      debounceRef.current = setTimeout(() => {
        startTransition(async () => {
          const data = await globalSearch(value);
          setResults(data);
        });
      }, 250);
    },
    [],
  );

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    router.push(href);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleNavigate(results[selectedIndex].href);
    }
  };

  return (
    <div ref={containerRef} className='relative w-full max-w-md'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          ref={inputRef}
          placeholder='Search users, products, tickets... (⌘K)'
          className='h-9 w-full rounded-lg border-brand-border/50 bg-white pl-9 pr-8 text-sm shadow-sm focus:border-brand focus:ring-1 focus:ring-brand/20'
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-brand-dark'
          >
            <X className='h-3.5 w-3.5' />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className='absolute top-full z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-brand-border/50 bg-white shadow-lg'>
          {isPending && results.length === 0 && (
            <div className='flex items-center gap-2 px-4 py-3'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent' />
              <span className='text-sm text-muted-foreground'>Searching...</span>
            </div>
          )}

          {!isPending && results.length === 0 && query.length >= 2 && (
            <div className='px-4 py-3 text-sm text-muted-foreground'>
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {results.length > 0 && (
            <ul className='max-h-80 overflow-y-auto py-1'>
              {results.map((result, index) => {
                const Icon = typeIcons[result.type];
                return (
                  <li key={result.id}>
                    <button
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        index === selectedIndex
                          ? 'bg-brand-light/60'
                          : 'hover:bg-brand-light/40'
                      }`}
                      onClick={() => handleNavigate(result.href)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColors[result.type]}`}>
                        <Icon className='h-4 w-4' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium text-brand-dark'>
                          {result.title}
                        </p>
                        <p className='truncate text-xs text-muted-foreground'>
                          {result.subtitle}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${typeColors[result.type]}`}>
                        {typeLabels[result.type]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {results.length > 0 && (
            <div className='border-t border-brand-border/30 px-4 py-2'>
              <p className='text-[10px] text-muted-foreground'>
                <kbd className='rounded border px-1 py-0.5 text-[9px]'>↑↓</kbd> Navigate
                <span className='mx-1.5'>·</span>
                <kbd className='rounded border px-1 py-0.5 text-[9px]'>↵</kbd> Open
                <span className='mx-1.5'>·</span>
                <kbd className='rounded border px-1 py-0.5 text-[9px]'>Esc</kbd> Close
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
