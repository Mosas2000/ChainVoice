import { useEffect } from 'react';

/**
 * Lock the document body scroll while `locked` is true.
 *
 * Stores the previous overflow value and restores it on cleanup so
 * multiple consumers won't clobber each other. Useful for modal-like
 * overlays where background scrolling would be disorienting.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
}
