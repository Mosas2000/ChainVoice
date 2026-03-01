import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as a circle instead of a rounded rectangle. */
  round?: boolean;
}

/**
 * A low-level skeleton placeholder that pulses to indicate loading.
 * Compose higher-level skeleton screens out of multiple Skeleton blocks.
 *
 * Includes a visually-hidden "Loading…" span so individual blocks are
 * not silent when inspected by assistive technology.  Wrap groups of
 * skeletons in a role="status" container with a descriptive aria-label
 * to avoid excessive announcements.
 */
export function Skeleton({ className, round = false, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        round ? 'rounded-full' : 'rounded-md',
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
