/**
 * A numeric value representing a point in time on the blockchain.
 *
 * In main-net data this will be a Bitcoin burn block height (currently
 * in the 800 000+ range). Stub / mock services may instead return a
 * Unix-millisecond timestamp. The {@link blockHeightToTimestamp}
 * utility and the `<Timestamp>` component handle both transparently.
 */
export type BlockTimestamp = number;

export interface Profile {
  username: string;
  bio?: string;
  avatarUrl?: string;
  /** Block height (on-chain) or Unix-ms timestamp (stubs) of profile creation. */
  createdAt: BlockTimestamp;
  /** Block height or Unix-ms timestamp of the last profile update. */
  updatedAt?: BlockTimestamp;
}

export interface UserStats {
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface Message {
  id?: number;
  author: string;
  content: string;
  /** Block height (on-chain) or Unix-ms timestamp (stubs) of the message. */
  timestamp: BlockTimestamp;
  isPublic: boolean;
  recipient?: string;
}

export interface Reaction {
  reactionType: string;
  /** Block height (on-chain) or Unix-ms timestamp (stubs) of the reaction. */
  reactedAt: BlockTimestamp;
}

export interface FollowInfo {
  isFollowing: boolean;
  /** Block height (on-chain) or Unix-ms timestamp (stubs) when the follow occurred. */
  followedAt?: BlockTimestamp;
}

// ── Optimistic UI ─────────────────────────────────

/** Lifecycle state of an optimistic entry while the transaction is in flight. */
export type OptimisticStatus = 'pending' | 'confirmed' | 'failed';

/**
 * A message injected into the feed immediately after submission,
 * before the blockchain transaction has been confirmed.
 */
export interface OptimisticMessage {
  /** Locally-generated id so React can key the element. */
  localId: string;
  /** The blockchain transaction id returned by the wallet. */
  txId: string;
  /** The message content the user typed. */
  content: string;
  /** Author's STX address. */
  author: string;
  /** Whether this is a public or direct message. */
  isPublic: boolean;
  /** Optional recipient for direct messages. */
  recipient?: string;
  /** Unix-ms timestamp of when the entry was created locally. */
  createdAt: number;
  /** Current lifecycle status. */
  status: OptimisticStatus;
}

/**
 * An optimistic follow or unfollow action shown immediately in the UI
 * while the on-chain transaction confirms.
 */
export interface OptimisticFollow {
  /** Locally-generated id. */
  localId: string;
  /** The blockchain transaction id. */
  txId: string;
  /** The address being followed / unfollowed. */
  targetAddress: string;
  /** Whether this is a follow (true) or unfollow (false) action. */
  isFollow: boolean;
  /** Unix-ms timestamp of when the entry was created locally. */
  createdAt: number;
  /** Current lifecycle status. */
  status: OptimisticStatus;
}
