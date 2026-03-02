import { useState, useCallback } from 'react';
import { formatTimestamp, toISOString } from '@/lib/formatTimestamp';
import { BlockHeightBadge } from '@/components/ui/block-height-badge';
import { useInterval } from '@/hooks/useInterval';

type TimestampFormat = 'relative' | 'short' | 'long';

/**
 * How often to re-render relative timestamps. 60 seconds keeps
 * "Xm ago" labels reasonably fresh without burning CPU.
 */
const RELATIVE_REFRESH_MS = 60_000;

interface TimestampProps {
  /** Raw numeric value — block height, Unix seconds, or Unix ms */
  value: number;
  /** Display format. Defaults to 'relative'. */
  format?: TimestampFormat;
  /** Whether to show the block height badge alongside the time */
  showBlockHeight?: boolean;
  className?: string;
}

/**
 * Semantic <time> element with auto-formatted display text and an
 * optional block height badge. Wraps the formatTimestamp utility so
 * every timestamp in the app uses the same rendering logic.
 *
 * When the format is 'relative' the component automatically re-renders
 * every minute so that labels like "2m ago" stay accurate without the
 * caller managing any timers.
 *
 * The full long-form date is always available via the title attribute
 * for accessibility, regardless of the visible format chosen.
 */
export function Timestamp({
  value,
  format = 'relative',
  showBlockHeight = false,
  className = '',
}: TimestampProps) {
  const [, setTick] = useState(0);

  // Force a re-render so formatTimestamp recalculates the relative label
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  // Only tick when viewing relative timestamps
  useInterval(refresh, format === 'relative' ? RELATIVE_REFRESH_MS : null);

  const displayText = formatTimestamp(value, { format });
  const isoString = toISOString(value);
  const longText = formatTimestamp(value, { format: 'long' });

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <time dateTime={isoString} title={longText} className="text-xs text-muted-foreground">
        {displayText}
      </time>
      {showBlockHeight && <BlockHeightBadge value={value} />}
    </span>
  );
}
