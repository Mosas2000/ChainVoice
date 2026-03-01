import { cn } from '@/lib/utils';

interface CharacterCounterProps {
  current: number;
  max: number;
  /** Percentage of max at which the counter turns to a warning colour (default 80) */
  warnAt?: number;
  /** Show a thin progress bar beneath the text (default false) */
  showBar?: boolean;
}

/**
 * Displays "current / max" and changes colour as the limit approaches.
 */
export function CharacterCounter({
  current,
  max,
  warnAt = 80,
  showBar = false,
}: CharacterCounterProps) {
  const remaining = max - current;
  const pct = Math.min((current / max) * 100, 100);

  const colour =
    pct >= 100
      ? 'text-destructive font-medium'
      : pct >= warnAt
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-muted-foreground';

  const barColour =
    pct >= 100
      ? 'bg-destructive'
      : pct >= warnAt
        ? 'bg-yellow-500'
        : 'bg-primary';

  return (
    <div className="inline-flex flex-col items-end gap-0.5">
      <span
        className={cn('text-xs tabular-nums', colour)}
        role="status"
        aria-live="polite"
        aria-label={`${remaining} characters remaining`}
      >
        {current} / {max}
      </span>
      {showBar && (
        <div className="h-0.5 w-16 rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', barColour)}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
