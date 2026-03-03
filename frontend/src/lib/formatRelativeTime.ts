/**
 * Format a timestamp as a short human-readable relative time string.
 *
 * Examples: "just now", "2 m ago", "15 m ago", "1 h ago".
 */
export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;

  if (diff < 60_000) return 'just now';

  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;

  const days = Math.floor(hours / 24);
  return `${days} d ago`;
}
