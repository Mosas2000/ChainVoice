import { useState } from 'react';
import { useReactToMultiple } from '@/hooks/useBatchContract';
import { Button } from '@/components/ui/button';
import { Heart, ThumbsUp, Smile, Star } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface BatchReactionButtonProps {
    messageIds: number[];
    reactionType?: 'like' | 'love' | 'smile' | 'star';
}

const reactionIcons = {
    like: ThumbsUp,
    love: Heart,
    smile: Smile,
    star: Star,
};

export function BatchReactionButton({
    messageIds,
    reactionType = 'like'
}: BatchReactionButtonProps) {
    const reactToMultiple = useReactToMultiple();
    const { showToast } = useToast();
    const Icon = reactionIcons[reactionType];

    const handleReact = async () => {
        try {
            await reactToMultiple.mutateAsync({ messageIds, reactionType });
            showToast(`Reacted to ${messageIds.length} messages!`, 'success');
        } catch (error) {
            showToast('Failed to react', 'error');
            console.error(error);
        }
    };

    return (
        <Button
            onClick={handleReact}
            disabled={reactToMultiple.isPending}
            variant="outline"
            size="sm"
        >
            <Icon className="w-4 h-4 mr-2" />
            {reactToMultiple.isPending
                ? 'Reacting...'
                : `${reactionType} All (${messageIds.length})`}
        </Button>
    );
}
