import {
  standardPrincipalCV,
  stringAsciiCV,
  PostConditionMode,
} from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
import { userSession } from './auth';
import { CONTRACTS, APP_DETAILS } from '@/config/contracts';
import type { Profile, UserStats, FollowInfo } from '@/types';

export async function createProfile(
  username: string,
  bio: string,
  avatarUrl: string
): Promise<void> {
  await openContractCall({
    contractAddress: CONTRACTS.profiles.address,
    contractName: CONTRACTS.profiles.name,
    functionName: 'create-profile',
    functionArgs: [
      stringAsciiCV(username),
      stringAsciiCV(bio),
      stringAsciiCV(avatarUrl),
    ],
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
    appDetails: APP_DETAILS,
  });
}

export async function updateProfile(
  username: string,
  bio: string,
  avatarUrl: string
): Promise<void> {
  await openContractCall({
    contractAddress: CONTRACTS.profiles.address,
    contractName: CONTRACTS.profiles.name,
    functionName: 'update-profile',
    functionArgs: [
      stringAsciiCV(username),
      stringAsciiCV(bio),
      stringAsciiCV(avatarUrl),
    ],
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
    appDetails: APP_DETAILS,
  });
}

export async function followUser(userToFollow: string): Promise<void> {
  await openContractCall({
    contractAddress: CONTRACTS.profiles.address,
    contractName: CONTRACTS.profiles.name,
    functionName: 'follow-user',
    functionArgs: [standardPrincipalCV(userToFollow)],
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
    appDetails: APP_DETAILS,
  });
}

export async function unfollowUser(userToUnfollow: string): Promise<void> {
  await openContractCall({
    contractAddress: CONTRACTS.profiles.address,
    contractName: CONTRACTS.profiles.name,
    functionName: 'unfollow-user',
    functionArgs: [standardPrincipalCV(userToUnfollow)],
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
    appDetails: APP_DETAILS,
  });
}

export async function getProfile(userAddress: string): Promise<Profile | null> {
  // TODO: Implement read-only function call
  return {
    username: 'user',
    createdAt: Date.now(),
  };
}

export async function getUserStats(userAddress: string): Promise<UserStats> {
  // TODO: Implement read-only function call
  return {
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  };
}

export async function isFollowing(
  follower: string,
  following: string
): Promise<FollowInfo> {
  // TODO: Implement read-only function call
  return {
    isFollowing: false,
  };
}
