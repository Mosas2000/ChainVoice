import { Blocks } from 'lucide-react';
import { isBlockHeight } from '@/lib/timestamp';

interface BlockHeightBadgeProps {
  /** Raw value from the contract — either a block height or a stub timestamp */
  value: number;
  className?: string;
}

/**
 * Renders the Bitcoin block height as a small inline badge when the
 * value looks like a real block height. Shows nothing if the value
 * is already a Unix timestamp (from stub services), avoiding
 * confusion during development.
 *
 * This gives on-chain-savvy users a direct reference to the block
 * that anchored the data, which they can look up in a block explorer.
 */
export function BlockHeightBadge({ value, className = '' }: BlockHeightBadgeProps) {
  if (!isBlockHeight(value)) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono ${className}`}
      title={`Bitcoin block #${value.toLocaleString()}`}
      aria-label={`Block number ${value.toLocaleString()}`}
    >
      <Blocks className="h-3 w-3" aria-hidden="true" />
      #{value.toLocaleString()}
    </span>
  );
}
