import {
  makeContractCall,
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  PostConditionMode,
} from '@stacks/transactions';
import { userSession } from './auth';
import { CONTRACTS } from '@/config/contracts';
import type { Profile, UserStats, FollowInfo } from '@/types';

export async function createProfile(
  username: string,
  displayName: string,
  bio: string,
  avatarUrl: string
): Promise<void> {
  const txOptions = {
    contractAddress: CONTRACTS.profiles.address,
    contractName: CONTRACTS.profiles.name,
    functionName: 'create-profile',
    functionArgs: [
      stringAsciiCV(username),
      stringUtf8CV(displayName),
      stringUtf8CV(bio),
      stringUtf8CV(avatarUrl),
    ],
    senderKey: userSession.loadUserData().appPrivateKey,
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
  };

  await makeContractCall(txOptions);
}

export async function updateProfile(
  displayName: string,
  bio: string,
  avatarUrl: string
): Promise<void> {
  const txOptions = {
    contractAddress: CONTRACTS.profiles.address,
    contractName: CONTRACTS.profiles.name,
    functionName: 'update-profile',
    functionArgs: [
      stringUtf8CV(displayName),
      stringUtf8CV(bio),
      stringUtf8CV(avatarUrl),
    ],
    senderKey: userSession.loadUserData().appPrivateKey,
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
  };

  await makeContractCall(txOptions);
}

export async function followUser(userToFollow: string): Promise<void> {
  const txOptions = {
    contractAddress: CONTRACTS.profiles.address,
    contractName: CONTRACTS.profiles.name,
    functionName: 'follow-user',
    functionArgs: [standardPrincipalCV(userToFollow)],
    senderKey: userSession.loadUserData().appPrivateKey,
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
  };

  await makeContractCall(txOptions);
}

export async function unfollowUser(userToUnfollow: string): Promise<void> {
  const txOptions = {
    contractAddress: CONTRACTS.profiles.address,
    contractName: CONTRACTS.profiles.name,
    functionName: 'unfollow-user',
    functionArgs: [standardPrincipalCV(userToUnfollow)],
    senderKey: userSession.loadUserData().appPrivateKey,
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
  };

  await makeContractCall(txOptions);
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
  };
}

export async function isFollowing(
  follower: string,
  following: string
): Promise<FollowInfo> {
  // TODO: Implement read-only function call
  return {
    followersCount: 0,
    followingCount: 0,
  };
}
