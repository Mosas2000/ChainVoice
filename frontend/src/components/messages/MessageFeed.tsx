import { useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { MessageCard } from './MessageCard';
import { MessageFeedSkeleton } from './MessageFeedSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface MessageFeedProps {
  limit?: number;
  authorAddress?: string;
}

export function MessageFeed({ limit = 20, authorAddress }: MessageFeedProps) {
  const { messages, loading, error, refetch } = useMessages(limit, authorAddress);

  useEffect(() => {
    refetch();
  }, [authorAddress, limit, refetch]);

  if (loading && messages.length === 0) {
    return <MessageFeedSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-3">
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {authorAddress ? 'Messages' : 'Recent Messages'}
        </h2>
        <Button onClick={refetch} variant="ghost" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-4">
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
