import { Loader2, ArrowDown } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  refreshing: boolean;
  threshold?: number;
}

/**
 * Visual indicator rendered above the feed during a pull-to-refresh
 * gesture.  Transitions from an arrow to a spinner once the pull
 * exceeds the threshold.
 */
export function PullToRefreshIndicator({
  pullDistance,
  refreshing,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  if (pullDistance <= 0 && !refreshing) return null;

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 180; // arrow rotates as you pull

  return (
    <div
      className="flex items-center justify-center overflow-hidden transition-[height] duration-200"
      style={{ height: refreshing ? 40 : pullDistance > 0 ? Math.min(pullDistance, 60) : 0 }}
    >
      {refreshing ? (
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      ) : (
        <ArrowDown
          className="h-5 w-5 text-muted-foreground transition-transform"
          style={{ transform: `rotate(${rotation}deg)`, opacity: progress }}
        />
      )}
    </div>
  );
}
