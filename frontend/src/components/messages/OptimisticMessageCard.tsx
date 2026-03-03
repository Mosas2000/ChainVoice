import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PendingBadge } from '@/components/ui/pending-badge';
import type { OptimisticMessage } from '@/types';
import { Globe, Lock, User } from 'lucide-react';

interface OptimisticMessageCardProps {
  entry: OptimisticMessage;
}

/**
 * A lightweight message card rendered for optimistic entries that
 * have not yet been confirmed on-chain.  Visually similar to a
 * regular MessageCard but with reduced opacity and a PendingBadge
 * showing the transaction status.
 */
export function OptimisticMessageCard({ entry }: OptimisticMessageCardProps) {
  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const isPending = entry.status === 'pending';
  const isFailed = entry.status === 'failed';

  return (
    <article
      aria-label={`Pending message from ${formatAddress(entry.author)}`}
      className={`transition-opacity duration-500 ${isFailed ? 'opacity-50' : isPending ? 'opacity-80' : ''}`}
    >
      <Card className={isFailed ? 'border-destructive/50' : 'border-dashed'}>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {formatAddress(entry.author)}
                    </span>
                    <PendingBadge status={entry.status} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatAddress(entry.author)}
                  </div>
                </div>
              </div>
              <Badge
                variant={entry.isPublic ? 'secondary' : 'outline'}
                className="shrink-0"
              >
                {entry.isPublic ? (
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
              {entry.content}
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
