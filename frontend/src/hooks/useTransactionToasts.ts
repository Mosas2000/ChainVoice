import { useEffect, useRef } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import { useToast, type ToastVariant } from '@/contexts/ToastContext';
import { ACTION_LABELS, type TrackedTransaction } from '@/types/transactions';

/**
 * Automatically show toast notifications whenever a tracked
 * transaction transitions to a new status.
 *
 * Mount this hook once at the app level (or near it) and it will
 * watch the transaction list for changes and fire the appropriate
 * toast for each status transition.
 */
export function useTransactionToasts(): void {
  const { transactions } = useTransactions();
  const { addToast } = useToast();

  // Track the last-seen status for each txId so we only toast on
  // actual state transitions, not on every render.
  const seenStatuses = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    transactions.forEach((tx) => {
      const lastStatus = seenStatuses.current.get(tx.txId);

      // Skip if we already toasted for this status
      if (lastStatus === tx.status) return;

      seenStatuses.current.set(tx.txId, tx.status);

      // Don't toast the initial "submitted" status for the first
      // time we see the tx — the submitting service already shows
      // a toast. Only toast on status changes after the initial add.
      if (!lastStatus && tx.status === 'submitted') return;

      const label = ACTION_LABELS[tx.action];
      const config = getToastConfig(tx, label);
      if (config) {
        addToast(config);
      }
    });
  }, [transactions, addToast]);
}

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

function getToastConfig(
  tx: TrackedTransaction,
  label: string,
): { title: string; description?: string; variant: ToastVariant; duration: number } | null {
  switch (tx.status) {
    case 'confirmed':
      return {
        title: label + ' confirmed',
        description: tx.description,
        variant: 'success',
        duration: 5000,
      };
    case 'failed':
      return {
        title: label + ' failed',
        description: tx.errorMessage ?? 'Transaction was dropped or aborted',
        variant: 'error',
        duration: 8000,
      };
    default:
      return null;
  }
}
