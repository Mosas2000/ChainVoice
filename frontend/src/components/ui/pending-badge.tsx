import type { OptimisticStatus } from '@/types';
import { Loader2, Check, AlertTriangle } from 'lucide-react';

interface PendingBadgeProps {
  status: OptimisticStatus;
  className?: string;
}

const statusConfig: Record<OptimisticStatus, { label: string; icon: typeof Loader2; color: string }> = {
  pending: {
    label: 'Confirming on chain…',
    icon: Loader2,
    color: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  },
  confirmed: {
    label: 'Confirmed',
    icon: Check,
    color: 'bg-green-500/15 text-green-700 dark:text-green-400',
  },
  failed: {
    label: 'Transaction failed',
    icon: AlertTriangle,
    color: 'bg-destructive/15 text-destructive',
  },
};

/**
 * A small badge that communicates the optimistic transaction state
 * to the user.  Renders a spinner while pending, a check on
 * confirmation, or a warning triangle on failure.
 */
export function PendingBadge({ status, className = '' }: PendingBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.color} ${className}`}
      role="status"
      aria-label={config.label}
    >
      <Icon
        className={`h-3 w-3 ${status === 'pending' ? 'animate-spin' : ''}`}
      />
      {config.label}
    </span>
  );
}
