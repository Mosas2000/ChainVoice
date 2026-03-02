import { formatTimestamp, toISOString } from '@/lib/formatTimestamp';
import { BlockHeightBadge } from '@/components/ui/block-height-badge';

type TimestampFormat = 'relative' | 'short' | 'long';

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
 * The full long-form date is always available via the title attribute
 * for accessibility, regardless of the visible format chosen.
 */
export function Timestamp({
  value,
  format = 'relative',
  showBlockHeight = false,
  className = '',
}: TimestampProps) {
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
