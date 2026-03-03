import { useTransactionToasts } from '@/hooks/useTransactionToasts';

/**
 * Invisible component that mounts the transaction → toast bridge.
 * Place once inside both TransactionProvider and ToastProvider.
 */
export function TransactionToastBridge() {
  useTransactionToasts();
  return null;
}
