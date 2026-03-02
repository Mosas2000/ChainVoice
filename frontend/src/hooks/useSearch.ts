import { useState, useEffect, useCallback } from 'react';
import { searchProfiles } from '@/services/search';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { ProfileSearchResult } from '@/types/search';

interface UseSearchOptions {
  /** Minimum number of characters before a search fires */
  minChars?: number;
  /** Maximum results to request */
  limit?: number;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
}

interface UseSearchReturn {
  query: string;
  setQuery: (value: string) => void;
  results: ProfileSearchResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  clear: () => void;
}

/**
 * Encapsulates the search-as-you-type workflow: captures a raw query,
 * debounces it, fires a search when the debounced value meets the
 * minimum length, and exposes results with loading and error states.
 */
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { minChars = 2, limit = 20, debounceMs = 300 } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProfileSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebouncedValue(query, debounceMs);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setHasSearched(false);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length < minChars) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    let cancelled = false;

    const performSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await searchProfiles({
          query: debouncedQuery,
          limit,
        });

        if (!cancelled) {
          setResults(data);
          setHasSearched(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Search failed');
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    performSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, limit, minChars]);

  return { query, setQuery, results, loading, error, hasSearched, clear };
}
