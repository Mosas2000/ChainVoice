import { MessageCardSkeleton } from './MessageCardSkeleton';

interface MessageFeedSkeletonProps {
  /** Number of placeholder cards to display (default: 3). */
  count?: number;
}

/**
 * Renders several MessageCardSkeleton placeholders in a vertical stack.
 * Each card has a staggered animation delay so the shimmer ripples
 * through the list instead of pulsing uniformly.
 */
export function MessageFeedSkeleton({ count = 3 }: MessageFeedSkeletonProps) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading messages">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ animationDelay: `${i * 150}ms` }} className="animate-in fade-in">
          <MessageCardSkeleton />
        </div>
      ))}
    </div>
  );
}
