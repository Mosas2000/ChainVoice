import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Register a global keyboard shortcut (Cmd+K / Ctrl+K) that navigates
 * to the Discover page. This is a widely recognised shortcut for
 * search in modern web applications.
 *
 * Prevents the default browser behaviour (e.g. Chrome's address-bar
 * focus) so the shortcut consistently takes the user to the in-app
 * search experience.
 */
export function useSearchShortcut(): void {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;
      if (isMod && event.key === 'k') {
        event.preventDefault();
        navigate('/discover');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
}
