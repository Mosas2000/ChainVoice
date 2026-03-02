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
