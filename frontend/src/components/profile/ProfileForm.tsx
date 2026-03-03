import { useState, useEffect, useMemo } from 'react';
import { stringAsciiCV, PostConditionMode } from '@stacks/transactions';
import { useAuth } from '@/contexts/AuthContext';
import { useTrackedContractCall } from '@/hooks/useTrackedContractCall';
import { CONTRACTS, APP_DETAILS } from '@/config/contracts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CharacterCounter } from '@/components/ui/character-counter';
import { CheckCircle2, XCircle } from 'lucide-react';
import { LIMITS } from '@/config/limits';
import { validateUsername, isAscii } from '@/lib/validateUsername';
import { validateAvatarUrl } from '@/lib/validateUrl';
import type { Profile } from '@/types';

interface ProfileFormProps {
  existingProfile?: Profile | null;
  onSuccess?: () => void;
}

export function ProfileForm({ existingProfile, onSuccess }: ProfileFormProps) {
  const { isAuthenticated } = useAuth();
  const trackedCall = useTrackedContractCall();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usernameValidation = useMemo(() => validateUsername(username), [username]);
  const avatarUrlValidation = useMemo(() => validateAvatarUrl(avatarUrl), [avatarUrl]);

  const bioError = useMemo(() => {
    if (bio.length === 0) return null;
    if (bio.length > LIMITS.bio.max) return `Bio must be ${LIMITS.bio.max} characters or fewer`;
    if (!isAscii(bio)) return 'Bio must contain only ASCII characters (the contract uses string-ascii)';
    return null;
  }, [bio]);

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

    if (!usernameValidation.valid) {
      setError(usernameValidation.error || 'Invalid username');
      return;
    }

    if (bioError) {
      setError(bioError);
      return;
    }

    if (avatarUrl.length > 0 && !avatarUrlValidation.valid) {
      setError(avatarUrlValidation.error || 'Invalid avatar URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isUpdate = !!existingProfile;
      const functionName = isUpdate ? 'update-profile' : 'create-profile';

      const txId = await trackedCall({
        contractCallOptions: {
          contractAddress: CONTRACTS.profiles.address,
          contractName: CONTRACTS.profiles.name,
          functionName,
          functionArgs: [
            stringAsciiCV(username),
            stringAsciiCV(bio),
            stringAsciiCV(avatarUrl),
          ],
          network: CONTRACTS.network,
          postConditionMode: PostConditionMode.Deny,
          appDetails: APP_DETAILS,
        },
        action: isUpdate ? 'update-profile' : 'create-profile',
        description: 'Username: ' + username,
      });

      if (txId) {
        onSuccess?.();
      }
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
              <span className="text-xs text-muted-foreground font-normal ml-2">
                3–50 chars · lowercase letters, numbers, _ and -
              </span>
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="satoshi_nakamoto"
              required
              minLength={LIMITS.username.min}
              maxLength={LIMITS.username.max}
              pattern="[a-z0-9_-]+"
              title="Lowercase letters, numbers, underscores, and hyphens only"
              aria-invalid={!!usernameValidation.error}
              aria-describedby="username-feedback"
              className={
                usernameValidation.error ? 'border-destructive' :
                username.length > LIMITS.username.max ? 'border-destructive' : ''
              }
            />
            <div className="flex items-center justify-between mt-1">
              <div id="username-feedback">
                {usernameValidation.error ? (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {usernameValidation.error}
                  </p>
                ) : existingProfile ? (
                  <p className="text-xs text-muted-foreground">
                    Changing your username will release the old one
                  </p>
                ) : username.length > 0 ? (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Username format looks good
                  </p>
                ) : null}
              </div>
              <CharacterCounter current={username.length} max={LIMITS.username.max} />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Bio
              <span className="text-xs text-muted-foreground font-normal ml-2">
                ASCII characters only
              </span>
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={LIMITS.bio.max}
              aria-invalid={!!bioError}
              aria-describedby="bio-feedback"
              className={bioError ? 'border-destructive' : ''}
            />
            <div className="flex items-center justify-between mt-1">
              <div id="bio-feedback">
                {bioError ? (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {bioError}
                  </p>
                ) : null}
              </div>
              <CharacterCounter current={bio.length} max={LIMITS.bio.max} showBar />
            </div>
          </div>

          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium mb-1">
              Avatar URL
              <span className="text-xs text-muted-foreground font-normal ml-2">
                https:// only · max {LIMITS.avatarUrl.max}
              </span>
            </label>
            <Input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              type="url"
              maxLength={LIMITS.avatarUrl.max}
              aria-invalid={!!avatarUrlValidation.error}
              aria-describedby="avatar-url-feedback"
              className={avatarUrlValidation.error ? 'border-destructive' : ''}
            />
            <div className="flex items-center justify-between mt-1">
              <div id="avatar-url-feedback">
                {avatarUrlValidation.error ? (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {avatarUrlValidation.error}
                  </p>
                ) : avatarUrl.length > 0 ? (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Valid URL
                  </p>
                ) : null}
              </div>
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
              !usernameValidation.valid ||
              !!bioError ||
              !avatarUrlValidation.valid
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
