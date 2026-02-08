import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { followUser, unfollowUser } from '@/services/profiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Profile, UserStats, FollowInfo } from '@/types';
import { User, Calendar, Users } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  stats?: UserStats | null;
  followInfo?: FollowInfo | null;
  onFollowChange?: () => void;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export function ProfileCard({
  profile,
  stats,
  followInfo,
  onFollowChange,
  isOwnProfile = false,
  onEdit,
}: ProfileCardProps) {
  const { isAuthenticated, userAddress } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFollowToggle = async () => {
    if (!isAuthenticated || !userAddress) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (followInfo?.isFollowing) {
        await unfollowUser(profile.owner);
      } else {
        await followUser(profile.owner);
      }
      onFollowChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const displayName = profile.displayName || profile.username;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatarUrl || undefined} alt={displayName} />
              <AvatarFallback>
                {profile.avatarUrl ? <User className="h-8 w-8" /> : getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{displayName}</CardTitle>
              <CardDescription>@{profile.username}</CardDescription>
              {profile.isVerified && (
                <Badge variant="secondary" className="mt-1">
                  Verified
                </Badge>
              )}
            </div>
          </div>

          {isOwnProfile ? (
            <Button onClick={onEdit} variant="outline" size="sm">
              Edit Profile
            </Button>
          ) : (
            isAuthenticated &&
            userAddress !== profile.owner && (
              <Button
                onClick={handleFollowToggle}
                disabled={loading}
                variant={followInfo?.isFollowing ? 'outline' : 'default'}
                size="sm"
              >
                {loading ? 'Loading...' : followInfo?.isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.bio && (
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(profile.createdAt)}</span>
          </div>
        </div>

        {stats && (
          <div className="flex items-center gap-6 pt-2 border-t">
            <div className="text-center">
              <div className="font-semibold">{stats.messageCount}</div>
              <div className="text-xs text-muted-foreground">Messages</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{stats.followerCount}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{stats.followingCount}</div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-2 rounded-md">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
