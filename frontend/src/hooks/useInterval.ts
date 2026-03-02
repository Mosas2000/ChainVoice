import { useEffect, useRef } from 'react';

/**
 * Run a callback on a fixed interval, safely handling cleanup and
 * dynamic callback changes.
 *
 * Passing `null` as the delay pauses the interval without losing
 * the callback reference, so it starts again seamlessly when the
 * delay is restored.
 *
 * Inspired by Dan Abramov's "Making setInterval Declarative with
 * React Hooks" article.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  // Remember the latest callback without restarting the interval
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
}
