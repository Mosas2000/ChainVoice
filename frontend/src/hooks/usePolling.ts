import { useEffect, useRef } from 'react';

/**
 * Calls `callback` every `intervalMs` milliseconds.
 *
 * The hook uses a ref for the callback so the interval never
 * needs to be reset when the callback reference changes.
 * Passing `null` or `0` for `intervalMs` pauses the polling.
 */
export function usePolling(callback: () => void, intervalMs: number | null) {
  const savedCallback = useRef(callback);

  // Keep the ref up to date without restarting the interval.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (intervalMs === null || intervalMs <= 0) return;

    const id = setInterval(() => savedCallback.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
