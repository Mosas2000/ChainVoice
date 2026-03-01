import { ProfileCardSkeleton } from '@/components/profile/ProfileCardSkeleton';
import { MessageFeedSkeleton } from '@/components/messages/MessageFeedSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Full-page skeleton for the Profile route.
 * Renders the page heading, profile card, tab bar, and a short message
 * feed skeleton so the entire viewport looks populated during load.
 */
export function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Page heading */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Profile card */}
        <ProfileCardSkeleton />

        {/* Tab bar placeholder */}
        <div className="space-y-6">
          <div className="flex gap-2 border-b pb-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>

          {/* Messages tab content */}
          <MessageFeedSkeleton count={2} />
        </div>
      </div>
    </div>
  );
}
