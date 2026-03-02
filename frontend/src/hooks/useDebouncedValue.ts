import { useState, useEffect } from 'react';

/**
 * Debounce a rapidly changing value so downstream effects only fire
 * once the value has settled for the specified delay.
 *
 * Primary use case is search-as-you-type inputs where every keystroke
 * would otherwise trigger a network request.  The default delay of
 * 300ms balances responsiveness with request reduction.
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
