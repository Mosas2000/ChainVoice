import { ExternalLink } from 'lucide-react';
import type { TrackedTransaction } from '@/types/transactions';
import { ACTION_LABELS } from '@/types/transactions';
import { TransactionStatusBadge } from './TransactionStatusBadge';

interface TransactionHistoryItemProps {
  transaction: TrackedTransaction;
}

/**
 * Format a transaction ID for display — show the first 8 and last 6
 * characters with an ellipsis in between.
 */
function truncateTxId(txId: string): string {
  if (txId.length <= 16) return txId;
  return txId.slice(0, 8) + '...' + txId.slice(-6);
}

/**
 * Build a link to the transaction on the Stacks explorer.
 */
function explorerUrl(txId: string): string {
  return 'https://explorer.hiro.so/txid/' + txId;
}

/**
 * Format a relative time string from an ISO date.
 */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  return Math.floor(seconds / 86400) + 'd ago';
}

export function TransactionHistoryItem({ transaction }: TransactionHistoryItemProps) {
  const { txId, action, status, createdAt, description, errorMessage } = transaction;
  const label = ACTION_LABELS[action];

  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">{label}</span>
          <TransactionStatusBadge status={status} />
        </div>

        {description && (
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        )}

        {errorMessage && (
          <p className="text-xs text-destructive">{errorMessage}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span title={txId}>{truncateTxId(txId)}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={createdAt}>{timeAgo(createdAt)}</time>
        </div>
      </div>

      <a
        href={explorerUrl(txId)}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="View transaction on Stacks explorer"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
