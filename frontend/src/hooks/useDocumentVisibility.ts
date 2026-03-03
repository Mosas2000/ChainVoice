import { useState, useEffect } from 'react';

/**
 * Returns `true` when the browser tab is visible, `false` when hidden.
 *
 * This is useful for pausing expensive work (e.g. polling) while the
 * user has navigated away from the tab.
 */
export function useDocumentVisibility(): boolean {
  const [visible, setVisible] = useState(() => {
    if (typeof document === 'undefined') return true;
    return document.visibilityState === 'visible';
  });

  useEffect(() => {
    const handler = () => {
      setVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  return visible;
}
