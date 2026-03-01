import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * A skeleton placeholder that matches the layout of MessageCard.
 * Shows a pulsing avatar, name line, timestamp, body block, and action bar
 * so the user perceives instant structure while real data loads.
 */
export function MessageCardSkeleton() {
  return (
    <Card aria-label="Loading message" role="status">
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Skeleton round className="h-10 w-10" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-5 w-16" />
          </div>

          {/* Content lines */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Actions bar */}
          <div className="flex items-center gap-4 pt-2 border-t">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
