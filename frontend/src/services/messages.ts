import {
  makeContractCall,
  standardPrincipalCV,
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
    functionArgs: [uintCV(messageId), stringUtf8CV(emoji)],
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
    functionArgs: [uintCV(messageId), stringUtf8CV(emoji)],
    senderKey: userSession.loadUserData().appPrivateKey,
    network: CONTRACTS.network,
    postConditionMode: PostConditionMode.Deny,
  };

  await makeContractCall(txOptions);
}

export async function getMessage(messageId: number): Promise<Message | null> {
  // TODO: Implement read-only function call
  return {
    author: 'address',
    content: 'Sample message',
    timestamp: Date.now(),
    isPublic: true,
  };
}

export async function getMessageCount(): Promise<number> {
  // TODO: Implement read-only function call
  return 0;
}
