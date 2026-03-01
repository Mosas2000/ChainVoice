import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * A skeleton placeholder matching ProfileForm's layout.
 * Shows shimmer blocks for the title, three form fields, and a submit button.
 */
export function ProfileFormSkeleton() {
  return (
    <Card aria-label="Loading profile form" role="status">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Username field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Bio field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Avatar URL field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Submit button */}
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
