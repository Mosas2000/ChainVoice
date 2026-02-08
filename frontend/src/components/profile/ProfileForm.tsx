import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createProfile, updateProfile } from '@/services/profiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types';

interface ProfileFormProps {
  existingProfile?: Profile | null;
  onSuccess?: () => void;
}

export function ProfileForm({ existingProfile, onSuccess }: ProfileFormProps) {
  const { isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingProfile) {
      setUsername(existingProfile.username);
      setDisplayName(existingProfile.displayName || '');
      setBio(existingProfile.bio || '');
      setAvatarUrl(existingProfile.avatarUrl || '');
    }
  }, [existingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (existingProfile) {
        await updateProfile(displayName, bio, avatarUrl);
      } else {
        await createProfile(username, displayName, bio, avatarUrl);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
          <CardDescription>Connect your wallet to get started</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingProfile ? 'Edit Profile' : 'Create Profile'}</CardTitle>
        <CardDescription>
          {existingProfile 
            ? 'Update your profile information' 
            : 'Set up your ChainVoice profile'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username {!existingProfile && <span className="text-red-500">*</span>}
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="satoshi_nakamoto"
              required
              disabled={!!existingProfile}
              className={existingProfile ? 'bg-muted' : ''}
            />
            {existingProfile && (
              <p className="text-xs text-muted-foreground mt-1">
                Username cannot be changed
              </p>
            )}
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-1">
              Display Name
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Satoshi Nakamoto"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Bio
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium mb-1">
              Avatar URL
            </label>
            <Input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
