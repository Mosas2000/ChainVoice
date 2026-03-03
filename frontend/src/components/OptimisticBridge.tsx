import { useEffect, useRef } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import { useOptimistic } from '@/contexts/OptimisticContext';
import { useToast } from '@/contexts/ToastContext';

/**
 * A headless component that watches tracked transactions and forwards
 * confirmed/failed status changes to the optimistic store.
 *
 * When a transaction reaches 'confirmed' status the corresponding
 * optimistic entry transitions to confirmed and is removed after a
 * short delay.  When a transaction fails the entry transitions to
 * 'failed', a toast notification is shown, and the entry is removed
 * after a longer delay.
 */
export function OptimisticBridge() {
  const { transactions } = useTransactions();
  const { messages, follows, confirmEntry, failEntry, removeEntry } = useOptimistic();
  const { addToast } = useToast();

  // Track which txIds we've already processed so we don't fire
  // duplicate confirmEntry / failEntry calls.
  const processedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const tx of transactions) {
      if (processedRef.current.has(tx.txId)) continue;

      if (tx.status === 'confirmed') {
        processedRef.current.add(tx.txId);
        confirmEntry(tx.txId);

        // Remove the optimistic entry after a short animation window
        // so the user can see the confirmed badge before it disappears.
        setTimeout(() => {
          removeEntry(tx.txId);
        }, 3000);
      }

      if (tx.status === 'failed') {
        processedRef.current.add(tx.txId);
        failEntry(tx.txId);

        // Figure out a useful description for the toast.
        const failedMessage = messages.find((m) => m.txId === tx.txId);
        const failedFollow = follows.find((f) => f.txId === tx.txId);
        const description = failedMessage
          ? 'Your message was not confirmed and has been reverted.'
          : failedFollow
            ? `Your ${failedFollow.isFollow ? 'follow' : 'unfollow'} action was not confirmed.`
            : 'A pending action was not confirmed on-chain.';

        addToast({
          title: 'Transaction failed',
          description,
          variant: 'error',
          duration: 8000,
        });

        // Keep the failed entry visible longer so the user can read
        // the error, then clean it up.
        setTimeout(() => {
          removeEntry(tx.txId);
        }, 10_000);
      }
    }
  }, [transactions, messages, follows, confirmEntry, failEntry, removeEntry, addToast]);

  return null;
}
