import { MessageFeedSkeleton } from '@/components/messages/MessageFeedSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Full-page skeleton for the Feed route.
 * Renders the heading, a composer placeholder, and a message feed skeleton.
 */
export function FeedPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Page heading */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Composer placeholder */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-24 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-9 w-28" />
            </div>
          </CardContent>
        </Card>

        {/* Message feed */}
        <MessageFeedSkeleton count={4} />
      </div>
    </div>
  );
}
