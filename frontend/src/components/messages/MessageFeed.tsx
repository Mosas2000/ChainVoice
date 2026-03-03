import { useEffect, useCallback, useRef, useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { MessageCard } from './MessageCard';
import { NewMessagesBanner } from './NewMessagesBanner';
import { PullToRefreshIndicator } from './PullToRefreshIndicator';
import { MessageFeedSkeleton } from '@/components/skeletons';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import { POLLING } from '@/config/polling';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface MessageFeedProps {
  limit?: number;
  authorAddress?: string;
  /** Polling interval in milliseconds.  Pass `null` to disable polling. */
  pollInterval?: number | null;
}

export function MessageFeed({ limit = 20, authorAddress, pollInterval }: MessageFeedProps) {
  const { messages, loading, error, newMessageCount, lastRefreshedAt, refetch, dismissNewMessages } = useMessages(limit, authorAddress, pollInterval);

  // Pull-to-refresh on touch devices
  const feedRef = useRef<HTMLDivElement>(null);
  const { pullDistance, refreshing } = usePullToRefresh(feedRef, {
    onRefresh: refetch,
    threshold: POLLING.pullToRefreshThreshold,
  });

  /** Fetch new messages and scroll back to the top of the feed. */
  const loadNewMessages = useCallback(() => {
    refetch();
    feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [refetch]);

  useEffect(() => {
    refetch();
  }, [authorAddress, limit, refetch]);

  // Ticking relative time label (e.g. "2 m ago")
  const [relativeLabel, setRelativeLabel] = useState(() => formatRelativeTime(lastRefreshedAt));
  useEffect(() => {
    setRelativeLabel(formatRelativeTime(lastRefreshedAt));
    const id = setInterval(() => setRelativeLabel(formatRelativeTime(lastRefreshedAt)), POLLING.relativeTimeTick);
    return () => clearInterval(id);
  }, [lastRefreshedAt]);

  if (loading && messages.length === 0) {
    return <MessageFeedSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div role="alert" className="text-center space-y-3">
            <p className="text-sm text-destructive">Failed to load messages</p>
            <p className="text-xs text-muted-foreground">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              {authorAddress ? 'This user hasn\'t posted any messages yet' : 'No messages yet'}
            </p>
            <p className="text-xs text-muted-foreground">
              {authorAddress ? 'Check back later!' : 'Be the first to share your voice!'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={feedRef} className="space-y-4">
      {/* Pull-to-refresh visual indicator (touch devices) */}
      <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {authorAddress ? 'Messages' : 'Recent Messages'}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground" aria-label="Last refreshed">
            {relativeLabel}
          </span>
          <Button onClick={refetch} variant="ghost" size="sm" disabled={loading} aria-label="Refresh messages">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* New messages banner */}
      <NewMessagesBanner
        count={newMessageCount}
        onLoad={loadNewMessages}
        onDismiss={dismissNewMessages}
      />

      <div className="space-y-4" aria-live="polite">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onReactionChange={refetch}
          />
        ))}
      </div>

      {messages.length >= limit && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Showing {messages.length} most recent messages
          </p>
        </div>
      )}
    </div>
  );
}
