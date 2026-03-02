import { blockHeightToTimestamp, isBlockHeight } from './blockTime';

type TimestampFormat = 'relative' | 'short' | 'long' | 'iso';

interface FormatTimestampOptions {
  /** Output style. Defaults to 'relative' for recent times. */
  format?: TimestampFormat;
  /** Treat the input as a block height regardless of heuristic detection */
  forceBlockHeight?: boolean;
}

/**
 * Convert a raw numeric timestamp (Unix ms, Unix seconds, or Stacks
 * burn block height) into a human-readable string.
 *
 * Centralises all date formatting so every component in the app
 * renders time consistently. The function auto-detects whether the
 * input looks like a block height or a conventional timestamp.
 */
export function formatTimestamp(
  raw: number,
  options: FormatTimestampOptions = {}
): string {
  const { format = 'relative', forceBlockHeight = false } = options;

  const ms =
    forceBlockHeight || isBlockHeight(raw)
      ? blockHeightToTimestamp(raw)
      : raw > 1e12
        ? raw
        : raw * 1000;

  const date = new Date(ms);

  switch (format) {
    case 'iso':
      return date.toISOString();

    case 'long':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    case 'short':
      return formatShortDate(date);

    case 'relative':
    default:
      return formatRelativeTime(date);
  }
}

/**
 * Get the ISO string for use in the datetime attribute of <time> tags.
 * Handles the same multi-format input as formatTimestamp.
 */
export function toISOString(raw: number): string {
  return formatTimestamp(raw, { format: 'iso' });
}

// ────────────────────────────────────────────────
// Internal helpers
// ────────────────────────────────────────────────

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 0) return 'just now';
  if (diffSeconds < 60) return 'just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86_400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604_800) return `${Math.floor(diffSeconds / 86_400)}d ago`;

  return formatShortDate(date);
}

function formatShortDate(date: Date): string {
  const now = new Date();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
