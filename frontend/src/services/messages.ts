import {
  makeContractCall,
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  PostConditionMode,
} from '@stacks/transactions';
import { userSession } from './auth';
import { CONTRACTS } from '@/config/contracts';
import type { Message, Reaction } from '@/types';

export async function postPublicMessage(content: string): Promise<void> {
  const txOptions = {
    contractAddress: CONTRACTS.messages.address,
    contractName: CONTRACTS.messages.name,
    functionName: 'post-public-message',
    functionArgs: [stringUtf8CV(content)],
    senderKey: userSession.loadUserData().appPrivateKey,
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
  };

  await makeContractCall(txOptions);
}

export async function sendDirectMessage(
  recipient: string,
  content: string
): Promise<void> {
  const txOptions = {
    contractAddress: CONTRACTS.messages.address,
    contractName: CONTRACTS.messages.name,
    functionName: 'send-direct-message',
    functionArgs: [standardPrincipalCV(recipient), stringUtf8CV(content)],
    senderKey: userSession.loadUserData().appPrivateKey,
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
  };

  await makeContractCall(txOptions);
}

export async function reactToMessage(
  messageId: number,
  emoji: string
): Promise<void> {
  const txOptions = {
    contractAddress: CONTRACTS.messages.address,
    contractName: CONTRACTS.messages.name,
    functionName: 'react-to-message',
    functionArgs: [uintCV(messageId), stringAsciiCV(emoji)],
    senderKey: userSession.loadUserData().appPrivateKey,
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
  };

  await makeContractCall(txOptions);
}

export async function removeReaction(
  messageId: number,
  emoji: string
): Promise<void> {
  const txOptions = {
    contractAddress: CONTRACTS.messages.address,
    contractName: CONTRACTS.messages.name,
    functionName: 'remove-reaction',
    functionArgs: [uintCV(messageId)],
    senderKey: userSession.loadUserData().appPrivateKey,
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
  };

  await makeContractCall(txOptions);
}

export async function getMessage(messageId: number): Promise<Message | null> {
  // TODO: Implement read-only function call
  // Return a realistic burn block height rather than Date.now() so the
  // Timestamp component exercises its block-height conversion path.
  return {
    author: 'address',
    content: 'Sample message',
    timestamp: 883_120,
    isPublic: true,
  };
}

export async function getMessageCount(): Promise<number> {
  // TODO: Implement read-only function call
  return 0;
}

export interface PaginationInfo {
  startId: number;
  endId: number;
  totalCount: number;
  pageSize: number;
  hasMore: boolean;
}

export async function getMessagesPage(
  start: number,
  pageSize: number
): Promise<PaginationInfo> {
  // TODO: Implement read-only call to get-messages-page
  return {
    startId: start,
    endId: Math.min(start + pageSize, 0),
    totalCount: 0,
    pageSize,
    hasMore: false,
  };
}

export async function getLatestMessagesInfo(
  pageSize: number
): Promise<PaginationInfo> {
  // TODO: Implement read-only call to get-latest-messages-info
  return {
    startId: 0,
    endId: 0,
    totalCount: 0,
    pageSize,
    hasMore: false,
  };
}
