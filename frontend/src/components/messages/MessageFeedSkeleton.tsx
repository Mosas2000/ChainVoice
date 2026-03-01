import { MessageCardSkeleton } from './MessageCardSkeleton';

interface MessageFeedSkeletonProps {
  /** Number of placeholder cards to display (default: 3). */
  count?: number;
}

/**
 * Renders several MessageCardSkeleton placeholders in a vertical stack.
 * Drop this in wherever MessageFeed shows its loading state.
 */
export function MessageFeedSkeleton({ count = 3 }: MessageFeedSkeletonProps) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading messages">
      {Array.from({ length: count }, (_, i) => (
        <MessageCardSkeleton key={i} />
      ))}
    </div>
  );
}
