import { useMessages } from '@/hooks/useMessages';
import { MessageCard } from './MessageCard';
import { MessageFeedSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, MessageSquare } from 'lucide-react';

function formatUpdatedAgo(ts: number | null): string | null {
  if (!ts) return null;
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return null;
}

interface MessageFeedProps {
  limit?: number;
  authorAddress?: string;
}

export function MessageFeed({ limit = 20, authorAddress }: MessageFeedProps) {
  const { messages, loading, refreshing, error, lastFetchedAt, refetch } = useMessages(limit, authorAddress);

  if (loading && messages.length === 0) {
    return <MessageFeedSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div role="alert" aria-live="assertive" className="text-center space-y-3">
            <p className="text-sm text-destructive">Failed to load messages</p>
            <p className="text-xs text-muted-foreground">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm" disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
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
            <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/40" aria-hidden="true" />
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {authorAddress ? 'Messages' : 'Recent Messages'}
          </h2>
          {lastFetchedAt && (
            <span className="text-xs text-muted-foreground">
              · Updated {formatUpdatedAgo(lastFetchedAt) || 'recently'}
            </span>
          )}
        </div>
        <Button onClick={refetch} variant="ghost" size="sm" disabled={loading || refreshing} aria-label="Refresh messages">
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

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
