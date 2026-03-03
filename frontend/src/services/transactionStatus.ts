import type { TransactionStatus } from '@/types/transactions';

/**
 * Stacks API base URL — matches the useBlockHeight hook.
 */
const STACKS_API_BASE = 'https://api.hiro.so';

/**
 * Maps the raw `tx_status` string returned by the Stacks API to
 * our internal TransactionStatus enum.
 */
function mapApiStatus(apiStatus: string): TransactionStatus {
  switch (apiStatus) {
    case 'success':
      return 'confirmed';
    case 'pending':
      return 'submitted';
    case 'abort_by_response':
    case 'abort_by_post_condition':
    case 'dropped_replace_by_fee':
    case 'dropped_replace_across_fork':
    case 'dropped_too_expensive':
    case 'dropped_stale_garbage_collect':
      return 'failed';
    default:
      return 'pending';
  }
}

export interface TransactionStatusResult {
  status: TransactionStatus;
  /** The raw Stacks API status string, for debugging. */
  rawStatus: string;
  /** The block height at which the tx was anchored, if confirmed. */
  blockHeight?: number;
}

/**
 * Fetch the current status of a transaction from the Stacks API.
 *
 * @param txId  Transaction ID including the `0x` prefix.
 * @returns     Resolved status or `null` if the API returned a
 *              non-200 response (e.g. tx not found yet).
 */
export async function fetchTransactionStatus(
  txId: string,
): Promise<TransactionStatusResult | null> {
  try {
    const response = await fetch(
      STACKS_API_BASE + '/extended/v1/tx/' + txId,
    );

    if (!response.ok) return null;

    const data = await response.json();
    const rawStatus: string = data.tx_status ?? 'unknown';

    return {
      status: mapApiStatus(rawStatus),
      rawStatus,
      blockHeight: data.block_height ?? undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Poll a transaction until it reaches a terminal state (confirmed or
 * failed), calling the provided `onUpdate` callback after each check.
 *
 * @param txId         Transaction ID including `0x` prefix.
 * @param onUpdate     Called with the latest status on every poll.
 * @param intervalMs   Polling interval in milliseconds (default 10 s).
 * @param maxAttempts  Safety limit to prevent infinite polling
 *                     (default 60 → ~10 minutes at 10 s intervals).
 * @returns            A cleanup function that stops polling.
 */
export function pollTransactionStatus(
  txId: string,
  onUpdate: (result: TransactionStatusResult) => void,
  intervalMs = 10_000,
  maxAttempts = 60,
): () => void {
  let attempts = 0;
  let stopped = false;

  async function tick() {
    if (stopped) return;
    attempts += 1;

    const result = await fetchTransactionStatus(txId);

    if (stopped) return;

    if (result) {
      onUpdate(result);

      if (result.status === 'confirmed' || result.status === 'failed') {
        stopped = true;
        return;
      }
    }

    if (attempts >= maxAttempts) {
      stopped = true;
      return;
    }

    timerId = window.setTimeout(tick, intervalMs);
  }

  let timerId = window.setTimeout(tick, intervalMs);

  return () => {
    stopped = true;
    clearTimeout(timerId);
  };
}
