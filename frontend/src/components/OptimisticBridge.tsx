import { useEffect, useRef } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import { useOptimistic } from '@/contexts/OptimisticContext';

/**
 * A headless component that watches tracked transactions and forwards
 * confirmed/failed status changes to the optimistic store.
 *
 * When a transaction reaches 'confirmed' status the corresponding
 * optimistic entry transitions to confirmed and is removed after a
 * short delay.  When a transaction fails the entry transitions to
 * 'failed' so the UI can show a revert notice.
 */
export function OptimisticBridge() {
  const { transactions } = useTransactions();
  const { confirmEntry, failEntry, removeEntry } = useOptimistic();

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

        // Keep the failed entry visible longer so the user can read
        // the error, then clean it up.
        setTimeout(() => {
          removeEntry(tx.txId);
        }, 10_000);
      }
    }
  }, [transactions, confirmEntry, failEntry, removeEntry]);

  return null;
}
