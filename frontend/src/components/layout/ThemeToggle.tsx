import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

/**
 * A header-bar toggle that cycles between light and dark mode.
 * The button shows a sun icon in dark mode and a moon icon in light mode,
 * indicating what clicking it will switch to.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const label = resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-200 hover:-rotate-12" />
      )}
    </Button>
  );
}
