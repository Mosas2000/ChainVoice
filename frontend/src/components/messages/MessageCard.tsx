import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { reactToMessage, removeReaction } from '@/services/messages';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Message } from '@/types';
import { Heart, MessageCircle, User, Lock, Globe } from 'lucide-react';

interface MessageCardProps {
  message: Message;
  authorUsername?: string;
  authorAvatar?: string;
  onReactionChange?: () => void;
}

export function MessageCard({
  message,
  authorUsername,
  authorAvatar,
  onReactionChange,
}: MessageCardProps) {
  const { isAuthenticated, userAddress } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasLiked = message.reactions?.some(
    (reaction) => reaction.reactor === userAddress && reaction.emoji === '❤️'
  );

  const likeCount = message.reactions?.filter((reaction) => reaction.emoji === '❤️').length || 0;

  const handleLikeToggle = async () => {
    if (!isAuthenticated || !userAddress) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (hasLiked) {
        await removeReaction(message.id, '❤️');
      } else {
        await reactToMessage(message.id, '❤️');
      }
      onReactionChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reaction');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = authorUsername || formatAddress(message.author);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={authorAvatar || undefined} alt={displayName} />
                <AvatarFallback>
                  {authorAvatar ? <User className="h-5 w-5" /> : authorUsername ? getInitials(authorUsername) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatAddress(message.author)}
                </div>
              </div>
            </div>
            <Badge variant={message.isPublic ? 'secondary' : 'outline'} className="shrink-0">
              {message.isPublic ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Direct
                </>
              )}
            </Badge>
          </div>

          {/* Content */}
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLikeToggle}
              disabled={loading || !isAuthenticated}
              className={hasLiked ? 'text-red-500 hover:text-red-600' : ''}
            >
              <Heart className={`h-4 w-4 mr-1 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>Reply</span>
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive text-xs p-2 rounded-md">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
