import { useState } from 'react';
import {
  standardPrincipalCV,
  stringUtf8CV,
  PostConditionMode,
} from '@stacks/transactions';
import { useAuth } from '@/contexts/AuthContext';
import { useTrackedContractCall } from '@/hooks/useTrackedContractCall';
import { CONTRACTS, APP_DETAILS } from '@/config/contracts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CharacterCounter } from '@/components/ui/character-counter';
import { Globe, Lock } from 'lucide-react';
import { LIMITS } from '@/config/limits';
import { getContractErrorMessage } from '@/lib/contractErrors';

interface MessageComposerProps {
  onSuccess?: () => void;
  recipientAddress?: string;
  recipientName?: string;
}

export function MessageComposer({ onSuccess, recipientAddress, recipientName }: MessageComposerProps) {
  const { isAuthenticated } = useAuth();
  const trackedCall = useTrackedContractCall();
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState(recipientAddress || '');
  const [isPublic, setIsPublic] = useState(!recipientAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxLength = LIMITS.messageContent.max;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please connect your wallet first');
      return;
    }

    if (content.trim().length === 0) {
      setError('Message cannot be empty');
      return;
    }

    if (content.length > maxLength) {
      setError(`Message exceeds ${maxLength} characters`);
      return;
    }

    if (!isPublic && !recipient) {
      setError('Please enter a recipient address for direct messages');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const preview = content.length > 60 ? content.slice(0, 57) + '...' : content;

      if (isPublic) {
        const txId = await trackedCall({
          contractCallOptions: {
            contractAddress: CONTRACTS.messages.address,
            contractName: CONTRACTS.messages.name,
            functionName: 'post-public-message',
            functionArgs: [stringUtf8CV(content)],
            network: CONTRACTS.network,
            postConditionMode: PostConditionMode.Deny,
            appDetails: APP_DETAILS,
          },
          action: 'post-message',
          description: preview,
        });
        if (txId) {
          setContent('');
          onSuccess?.();
        }
      } else {
        const txId = await trackedCall({
          contractCallOptions: {
            contractAddress: CONTRACTS.messages.address,
            contractName: CONTRACTS.messages.name,
            functionName: 'send-direct-message',
            functionArgs: [standardPrincipalCV(recipient), stringUtf8CV(content)],
            network: CONTRACTS.network,
            postConditionMode: PostConditionMode.Deny,
            appDetails: APP_DETAILS,
          },
          action: 'send-dm',
          description: preview,
        });
        if (txId) {
          setContent('');
          setRecipient('');
          onSuccess?.();
        }
      }
    } catch (err) {
      setError(getContractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Share Your Voice</CardTitle>
          <CardDescription>Connect your wallet to post messages</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Compose Message</CardTitle>
            <CardDescription className="text-sm">
              {isPublic ? 'Share with everyone' : 'Send a direct message'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={isPublic ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsPublic(true)}
              disabled={!!recipientAddress}
              aria-pressed={isPublic}
              aria-label="Public message"
            >
              <Globe className="h-4 w-4 mr-1" />
              Public
            </Button>
            <Button
              type="button"
              variant={!isPublic ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsPublic(false)}
              aria-pressed={!isPublic}
              aria-label="Direct message"
            >
              <Lock className="h-4 w-4 mr-1" />
              Direct
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isPublic && (
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium mb-1">
                Recipient Address {recipientName && `(${recipientName})`}
              </label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
                required
                disabled={!!recipientAddress}
                className={recipientAddress ? 'bg-muted' : ''}
              />
            </div>
          )}

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Message
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              className={content.length > maxLength ? 'border-destructive' : ''}
            />
            <div className="flex items-center justify-between mt-1">
              <div className="text-xs text-muted-foreground">
                {isPublic ? (
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Everyone can see this message
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Only you and the recipient can see this
                  </span>
                )}
              </div>
              <CharacterCounter current={content.length} max={maxLength} showBar />
            </div>
          </div>

          {error && (
            <div role="alert" className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading || content.length === 0 || content.length > maxLength} className="w-full">
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
