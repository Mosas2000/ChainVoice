export interface Profile {
  username: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: number;
  updatedAt?: number;
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
  timestamp: number;
  isPublic: boolean;
  recipient?: string;
}

export interface Reaction {
  reactionType: string;
  reactedAt: number;
}

export interface FollowInfo {
  isFollowing: boolean;
  followedAt?: number;
}
