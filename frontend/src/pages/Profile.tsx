import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { getUserStats, isFollowing } from '@/services/profiles';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { MessageFeed } from '@/components/messages/MessageFeed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UserStats, FollowInfo } from '@/types';

export function Profile() {
  const { isAuthenticated, userAddress } = useAuth();
  const { profile, loading: profileLoading, error: profileError, refetch } = useProfile(userAddress || undefined);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [followInfo, setFollowInfo] = useState<FollowInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (userAddress && profile) {
      loadStats();
    }
  }, [userAddress, profile]);

  const loadStats = async () => {
    if (!userAddress) return;
    
    setStatsLoading(true);
    try {
      const userStats = await getUserStats(userAddress);
      setStats(userStats);
      
      // For own profile, followInfo is not needed but we set it for consistency
      setFollowInfo({
        isFollowing: false,
        followerCount: userStats.followerCount,
        followingCount: userStats.followingCount,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    setIsEditing(false);
    refetch();
    loadStats();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Connect your wallet to view and manage your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading || statsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <p className="text-sm text-destructive">Failed to load profile</p>
              <p className="text-xs text-muted-foreground">{profileError}</p>
              <Button onClick={refetch} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
            <p className="text-muted-foreground">
              Set up your ChainVoice profile to start sharing your voice
            </p>
          </div>
          <ProfileForm onSuccess={handleProfileUpdate} />
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
            <p className="text-muted-foreground">Update your profile information</p>
          </div>
          <ProfileForm existingProfile={profile} onSuccess={handleProfileUpdate} />
          <Button onClick={() => setIsEditing(false)} variant="outline" className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">Manage your profile and view your messages</p>
        </div>

        <ProfileCard
          profile={profile}
          stats={stats}
          followInfo={followInfo}
          isOwnProfile={true}
          onEdit={() => setIsEditing(true)}
        />

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
            <TabsTrigger value="followers" className="flex-1" disabled>
              Followers
            </TabsTrigger>
            <TabsTrigger value="following" className="flex-1" disabled>
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="messages" className="mt-6">
            <MessageFeed authorAddress={userAddress || undefined} limit={50} />
          </TabsContent>
          <TabsContent value="followers" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Followers list coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="following" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Following list coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
