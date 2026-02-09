import { useState } from 'react';
import { useFollowMultipleUsers } from '@/hooks/useBatchContract';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface BatchFollowButtonProps {
    userAddresses: string[];
    onSuccess?: () => void;
}

export function BatchFollowButton({ userAddresses, onSuccess }: BatchFollowButtonProps) {
    const followMultiple = useFollowMultipleUsers();
    const { showToast } = useToast();

    const handleFollow = async () => {
        try {
            await followMultiple.mutateAsync(userAddresses);
            showToast(`Followed ${userAddresses.length} users!`, 'success');
            onSuccess?.();
        } catch (error) {
            showToast('Failed to follow users', 'error');
            console.error(error);
        }
    };

    return (
        <Button
            onClick={handleFollow}
            disabled={followMultiple.isPending}
            variant="default"
        >
            <UserPlus className="w-4 h-4 mr-2" />
            {followMultiple.isPending
                ? 'Following...'
                : `Follow All ${userAddresses.length}`}
        </Button>
    );
}
