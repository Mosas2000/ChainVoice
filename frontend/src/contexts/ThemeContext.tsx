import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Theme, ResolvedTheme } from '@/types/theme';
import { getStoredTheme, setStoredTheme, resolveTheme } from '@/lib/themeStorage';

interface ThemeContextValue {
  /** The user's chosen setting (light | dark | system). */
  theme: Theme;
  /** The actual applied theme after evaluating system preference. */
  resolvedTheme: ResolvedTheme;
  /** Update the theme and persist to localStorage. */
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyThemeToDocument(resolved: ResolvedTheme): void {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Override the default theme (useful for testing). */
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme() ?? defaultTheme);
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(theme));

  // Apply the resolved theme to <html> whenever it changes
  useEffect(() => {
    const next = resolveTheme(theme);
    setResolved(next);
    applyThemeToDocument(next);
  }, [theme]);

  // Listen for OS-level color-scheme changes when the user chose "system"
  useEffect(() => {
    if (theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const next = resolveTheme('system');
      setResolved(next);
      applyThemeToDocument(next);
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    setStoredTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
