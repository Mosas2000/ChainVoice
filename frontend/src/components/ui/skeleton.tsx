import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as a circle instead of a rounded rectangle. */
  round?: boolean;
}

/**
 * A low-level skeleton placeholder that pulses to indicate loading.
 * Compose higher-level skeleton screens out of multiple Skeleton blocks.
 */
export function Skeleton({ className, round = false, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        round ? 'rounded-full' : 'rounded-md',
        className,
      )}
      {...props}
    />
  );
}
