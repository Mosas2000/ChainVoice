import { useCallback } from 'react';
import { openContractCall, type ContractCallOptions } from '@stacks/connect';
import { useTransactions } from '@/contexts/TransactionContext';
import { useToast } from '@/contexts/ToastContext';
import { ACTION_LABELS, type TransactionAction } from '@/types/transactions';

interface TrackedCallOptions {
  /** The standard @stacks/connect contract call options. */
  contractCallOptions: Omit<ContractCallOptions, 'onFinish' | 'onCancel'>;
  /** Which ChainVoice action this call represents. */
  action: TransactionAction;
  /** Optional summary for the transaction history. */
  description?: string;
}

/**
 * A hook that wraps openContractCall with automatic transaction
 * tracking and toast notifications.
 *
 * Returns an async function that opens the wallet popup, and on
 * successful submission:
 *   1. Tracks the txId in TransactionContext (starts polling).
 *   2. Shows a "submitted" toast.
 *
 * If the user cancels the wallet popup, a brief info toast is shown
 * instead.
 */
export function useTrackedContractCall() {
  const { trackTransaction } = useTransactions();
  const { addToast } = useToast();

  const call = useCallback(
    ({ contractCallOptions, action, description }: TrackedCallOptions): Promise<string | null> => {
      const label = ACTION_LABELS[action];

      return new Promise((resolve) => {
        openContractCall({
          ...contractCallOptions,
          onFinish: (data) => {
            const txId = data.txId;
            trackTransaction(txId, action, description);

            addToast({
              title: label + ' submitted',
              description: 'Transaction is being processed on the blockchain',
              variant: 'loading',
              duration: 4000,
            });

            resolve(txId);
          },
          onCancel: () => {
            addToast({
              title: label + ' cancelled',
              description: 'You dismissed the wallet prompt',
              variant: 'default',
              duration: 3000,
            });

            resolve(null);
          },
        });
      });
    },
    [trackTransaction, addToast],
  );

  return call;
}
