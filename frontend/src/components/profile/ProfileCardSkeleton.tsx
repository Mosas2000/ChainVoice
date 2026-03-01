import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * A skeleton placeholder matching ProfileCard's layout.
 * Shows a pulsing avatar, name/username rows, bio lines, joined date,
 * and stats bar so the page feels populated while data loads.
 */
export function ProfileCardSkeleton() {
  return (
    <Card aria-label="Loading profile" role="status">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Skeleton round className="h-16 w-16" />
            <div className="space-y-2">
              {/* Display name */}
              <Skeleton className="h-5 w-32" />
              {/* @username */}
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          {/* Action button */}
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Joined date */}
        <div className="flex items-center gap-2">
          <Skeleton round className="h-4 w-4" />
          <Skeleton className="h-4 w-36" />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 pt-2 border-t">
          <div className="text-center space-y-1">
            <Skeleton className="h-5 w-8 mx-auto" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="text-center space-y-1">
            <Skeleton className="h-5 w-8 mx-auto" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="text-center space-y-1">
            <Skeleton className="h-5 w-8 mx-auto" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
