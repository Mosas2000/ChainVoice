import { openContractCall } from '@stacks/connect';
import {
    stringAsciiCV,
    stringUtf8CV,
    principalCV,
    uintCV,
    listCV,
    PostConditionMode
} from '@stacks/transactions';
import { CONTRACTS, APP_DETAILS } from '@/config/contracts';

export const batchContract = {
    async createProfileAndPost(username: string, bio: string, avatarUrl: string, message: string) {
        return await openContractCall({
            contractAddress: CONTRACTS.batch.address,
            contractName: CONTRACTS.batch.name,
            functionName: 'create-profile-and-post',
            functionArgs: [
                stringAsciiCV(username),
                stringAsciiCV(bio),
                stringAsciiCV(avatarUrl),
                stringUtf8CV(message),
            ],
            network: CONTRACTS.network,
            appDetails: APP_DETAILS,
            postConditionMode: PostConditionMode.Allow,
            onFinish: (data) => console.log('Profile created and message posted:', data),
        });
    },

    async followMultipleUsers(userAddresses: string[]) {
        return await openContractCall({
            contractAddress: CONTRACTS.batch.address,
            contractName: CONTRACTS.batch.name,
            functionName: 'follow-multiple-users',
            functionArgs: [listCV(userAddresses.map(addr => principalCV(addr)))],
            network: CONTRACTS.network,
            appDetails: APP_DETAILS,
            postConditionMode: PostConditionMode.Allow,
            onFinish: (data) => console.log('Followed multiple users:', data),
        });
    },

    async unfollowMultipleUsers(userAddresses: string[]) {
        return await openContractCall({
            contractAddress: CONTRACTS.batch.address,
            contractName: CONTRACTS.batch.name,
            functionName: 'unfollow-multiple-users',
            functionArgs: [listCV(userAddresses.map(addr => principalCV(addr)))],
            network: CONTRACTS.network,
            appDetails: APP_DETAILS,
            postConditionMode: PostConditionMode.Allow,
            onFinish: (data) => console.log('Unfollowed multiple users:', data),
        });
    },

    async postAndReact(message: string, messageId: number, reactionType: string) {
        return await openContractCall({
            contractAddress: CONTRACTS.batch.address,
            contractName: CONTRACTS.batch.name,
            functionName: 'post-and-react',
            functionArgs: [
                stringUtf8CV(message),
                uintCV(messageId),
                stringAsciiCV(reactionType),
            ],
            network: CONTRACTS.network,
            appDetails: APP_DETAILS,
            postConditionMode: PostConditionMode.Allow,
            onFinish: (data) => console.log('Posted and reacted:', data),
        });
    },

    async reactToMultiple(messageIds: number[], reactionType: string) {
        return await openContractCall({
            contractAddress: CONTRACTS.batch.address,
            contractName: CONTRACTS.batch.name,
            functionName: 'react-to-multiple',
            functionArgs: [
                listCV(messageIds.map(id => uintCV(id))),
                stringAsciiCV(reactionType),
            ],
            network: CONTRACTS.network,
            appDetails: APP_DETAILS,
            postConditionMode: PostConditionMode.Allow,
            onFinish: (data) => console.log('Reacted to multiple messages:', data),
        });
    },

    async sendMultipleDMs(recipients: string[], messages: string[]) {
        return await openContractCall({
            contractAddress: CONTRACTS.batch.address,
            contractName: CONTRACTS.batch.name,
            functionName: 'send-multiple-dms',
            functionArgs: [
                listCV(recipients.map(addr => principalCV(addr))),
                listCV(messages.map(msg => stringUtf8CV(msg))),
            ],
            network: CONTRACTS.network,
            appDetails: APP_DETAILS,
            postConditionMode: PostConditionMode.Allow,
            onFinish: (data) => console.log('Sent multiple DMs:', data),
        });
    },

    async updateProfileAndAnnounce(username: string, bio: string, avatarUrl: string, announcement: string) {
        return await openContractCall({
            contractAddress: CONTRACTS.batch.address,
            contractName: CONTRACTS.batch.name,
            functionName: 'update-profile-and-announce',
            functionArgs: [
                stringAsciiCV(username),
                stringAsciiCV(bio),
                stringAsciiCV(avatarUrl),
                stringUtf8CV(announcement),
            ],
            network: CONTRACTS.network,
            appDetails: APP_DETAILS,
            postConditionMode: PostConditionMode.Allow,
            onFinish: (data) => console.log('Profile updated and announced:', data),
        });
    },

    async followAndWelcome(userAddress: string, welcomeMessage: string) {
        return await openContractCall({
            contractAddress: CONTRACTS.batch.address,
            contractName: CONTRACTS.batch.name,
            functionName: 'follow-and-welcome',
            functionArgs: [
                principalCV(userAddress),
                stringUtf8CV(welcomeMessage),
            ],
            network: CONTRACTS.network,
            appDetails: APP_DETAILS,
            postConditionMode: PostConditionMode.Allow,
            onFinish: (data) => console.log('Followed and welcomed:', data),
        });
    },

    async postThread(messages: string[]) {
        return await openContractCall({
            contractAddress: CONTRACTS.batch.address,
            contractName: CONTRACTS.batch.name,
            functionName: 'post-thread',
            functionArgs: [listCV(messages.map(msg => stringUtf8CV(msg)))],
            network: CONTRACTS.network,
            appDetails: APP_DETAILS,
            postConditionMode: PostConditionMode.Allow,
            onFinish: (data) => console.log('Thread posted:', data),
        });
    },

    async cleanupInteractions(usersToUnfollow: string[], messageIdsToUnreact: number[]) {
        return await openContractCall({
            contractAddress: CONTRACTS.batch.address,
            contractName: CONTRACTS.batch.name,
            functionName: 'cleanup-interactions',
            functionArgs: [
                listCV(usersToUnfollow.map(addr => principalCV(addr))),
                listCV(messageIdsToUnreact.map(id => uintCV(id))),
            ],
            network: CONTRACTS.network,
            appDetails: APP_DETAILS,
            postConditionMode: PostConditionMode.Allow,
            onFinish: (data) => console.log('Cleanup complete:', data),
        });
    },
};
