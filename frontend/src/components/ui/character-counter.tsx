import { cn } from '@/lib/utils';

interface CharacterCounterProps {
  current: number;
  max: number;
  /** Percentage of max at which the counter turns to a warning colour (default 80) */
  warnAt?: number;
}

/**
 * Displays "current / max" and changes colour as the limit approaches.
 */
export function CharacterCounter({
  current,
  max,
  warnAt = 80,
}: CharacterCounterProps) {
  const remaining = max - current;
  const pct = (current / max) * 100;

  return (
    <span
      className={cn(
        'text-xs tabular-nums',
        pct >= 100
          ? 'text-destructive font-medium'
          : pct >= warnAt
            ? 'text-yellow-600 dark:text-yellow-400'
            : 'text-muted-foreground',
      )}
      role="status"
      aria-live="polite"
      aria-label={`${remaining} characters remaining`}
    >
      {current} / {max}
    </span>
  );
}
