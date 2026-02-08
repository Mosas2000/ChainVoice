export interface Profile {
  username: string;
  bio?: string;
  avatarUrl?: string;
  displayName?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface UserStats {
  followersCount: number;
  followingCount: number;
  postsCount?: number;
}

export interface Message {
  author: string;
  content: string;
  timestamp: number;
  isPublic: boolean;
  recipient?: string;
}

export interface Reaction {
  reactor: string;
  emoji: string;
  timestamp: number;
}

export interface FollowInfo {
  followersCount: number;
  followingCount: number;
}
