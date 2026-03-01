import type { Theme } from '@/types/theme';

const STORAGE_KEY = 'chainvoice-theme';

/**
 * Read the persisted theme preference from localStorage.
 * Returns null when nothing has been saved yet (first visit).
 */
export function getStoredTheme(): Theme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      return raw;
    }
    return null;
  } catch {
    // localStorage may throw in private browsing on some browsers
    return null;
  }
}

/** Persist the chosen theme to localStorage. */
export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Silently ignore write failures
  }
}
