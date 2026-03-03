/**
 * Possible states a Stacks transaction can be in, from submission
 * through to final confirmation or failure.
 */
export type TransactionStatus =
  | 'pending'
  | 'submitted'
  | 'confirmed'
  | 'failed';

/**
 * Human-readable labels for the contract functions that ChainVoice
 * invokes. These are shown in the transaction history so users
 * understand what each transaction was for.
 */
export type TransactionAction =
  | 'create-profile'
  | 'update-profile'
  | 'post-message'
  | 'send-dm'
  | 'follow'
  | 'unfollow'
  | 'react'
  | 'remove-reaction';

/**
 * Display-friendly names for each action, keyed by TransactionAction.
 */
export const ACTION_LABELS: Record<TransactionAction, string> = {
  'create-profile': 'Create Profile',
  'update-profile': 'Update Profile',
  'post-message': 'Post Message',
  'send-dm': 'Send Direct Message',
  follow: 'Follow User',
  unfollow: 'Unfollow User',
  react: 'React to Message',
  'remove-reaction': 'Remove Reaction',
};

/**
 * A transaction that the user has submitted via ChainVoice.
 * Stored in session state so the UI can display its progress.
 */
export interface TrackedTransaction {
  /** The on-chain transaction ID (hex string with 0x prefix). */
  txId: string;
  /** Which contract action this transaction represents. */
  action: TransactionAction;
  /** Current lifecycle status. */
  status: TransactionStatus;
  /** ISO timestamp of when the transaction was first tracked. */
  createdAt: string;
  /** ISO timestamp of the last status update. */
  updatedAt: string;
  /** Optional summary shown in the UI (e.g. "Posted: Hello world!"). */
  description?: string;
  /** If the transaction failed, a human-readable reason. */
  errorMessage?: string;
}
