import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { TransactionStatus } from '@/types/transactions';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; icon: typeof Clock; colorClass: string }
> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    colorClass: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
  },
  submitted: {
    label: 'Submitted',
    icon: Loader2,
    colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle,
    colorClass: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    colorClass: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  },
};

/**
 * Compact badge showing the lifecycle status of a tracked
 * transaction. The submitted state gets a spinning loader icon
 * while the others are static.
 */
export function TransactionStatusBadge({ status, className = '' }: TransactionStatusBadgeProps) {
  const { label, icon: Icon, colorClass } = STATUS_CONFIG[status];
  const isAnimated = status === 'submitted';

  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ' +
        colorClass + ' ' + className
      }
      aria-label={'Transaction status: ' + label}
    >
      <Icon className={'h-3 w-3' + (isAnimated ? ' animate-spin' : '')} aria-hidden="true" />
      {label}
    </span>
  );
}
