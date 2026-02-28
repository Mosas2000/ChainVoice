import { useMutation, useQueryClient } from '@tanstack/react-query';
import { batchContract } from '@/lib/contractBatch';

export function useCreateProfileAndPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ username, bio, avatarUrl, message }: {
            username: string; bio: string; avatarUrl: string; message: string
        }) => {
            return await batchContract.createProfileAndPost(username, bio, avatarUrl, message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });
}

export function useFollowMultipleUsers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userAddresses: string[]) => {
            return await batchContract.followMultipleUsers(userAddresses);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['isFollowing'] });
            queryClient.invalidateQueries({ queryKey: ['userStats'] });
        },
    });
}

export function usePostAndReact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ message, messageId, reactionType }: {
            message: string; messageId: number; reactionType: string
        }) => {
            return await batchContract.postAndReact(message, messageId, reactionType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ['reaction'] });
        },
    });
}

export function useReactToMultiple() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ messageIds, reactionType }: {
            messageIds: number[]; reactionType: string
        }) => {
            return await batchContract.reactToMultiple(messageIds, reactionType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reaction'] });
        },
    });
}

export function usePostThread() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (messages: string[]) => {
            return await batchContract.postThread(messages);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });
}

export function useSendMultipleDMs() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ recipients, messages }: {
            recipients: string[]; messages: string[]
        }) => {
            return await batchContract.sendMultipleDMs(recipients, messages);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });
}

export function useUpdateProfileAndAnnounce() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ username, bio, avatarUrl, announcement }: {
            username: string; bio: string; avatarUrl: string; announcement: string
        }) => {
            return await batchContract.updateProfileAndAnnounce(username, bio, avatarUrl, announcement);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });
}

export function useFollowAndWelcome() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userAddress, welcomeMessage }: {
            userAddress: string; welcomeMessage: string
        }) => {
            return await batchContract.followAndWelcome(userAddress, welcomeMessage);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['isFollowing'] });
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        },
    });
}
