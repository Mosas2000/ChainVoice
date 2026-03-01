import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createProfile, updateProfile } from '@/services/profiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CharacterCounter } from '@/components/ui/character-counter';
import { LIMITS } from '@/config/limits';
import type { Profile } from '@/types';

interface ProfileFormProps {
  existingProfile?: Profile | null;
  onSuccess?: () => void;
}

export function ProfileForm({ existingProfile, onSuccess }: ProfileFormProps) {
  const { isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingProfile) {
      setUsername(existingProfile.username);
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

    if (bio.length > LIMITS.bio.max) {
      setError(`Bio must be ${LIMITS.bio.max} characters or fewer`);
      return;
    }

    if (avatarUrl.length > LIMITS.avatarUrl.max) {
      setError(`Avatar URL must be ${LIMITS.avatarUrl.max} characters or fewer`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (existingProfile) {
        await updateProfile(username, bio, avatarUrl);
      } else {
        await createProfile(username, bio, avatarUrl);
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
              minLength={LIMITS.username.min}
              maxLength={LIMITS.username.max}
            />
            <div className="flex items-center justify-between mt-1">
              {existingProfile ? (
                <p className="text-xs text-muted-foreground">
                  Changing your username will release the old one
                </p>
              ) : (
                <span />
              )}
              <CharacterCounter current={username.length} max={LIMITS.username.max} />
            </div>
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
              maxLength={LIMITS.bio.max}
              className={bio.length > LIMITS.bio.max ? 'border-destructive' : ''}
            />
            <div className="flex justify-end mt-1">
              <CharacterCounter current={bio.length} max={LIMITS.bio.max} />
            </div>
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
              maxLength={LIMITS.avatarUrl.max}
            />
            <div className="flex justify-end mt-1">
              <CharacterCounter current={avatarUrl.length} max={LIMITS.avatarUrl.max} />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={
              loading ||
              bio.length > LIMITS.bio.max ||
              avatarUrl.length > LIMITS.avatarUrl.max ||
              username.length > LIMITS.username.max
            }
            className="w-full"
          >
            {loading ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
