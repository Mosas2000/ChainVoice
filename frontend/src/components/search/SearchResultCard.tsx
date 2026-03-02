import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import type { ProfileSearchResult } from '@/types/search';

interface SearchResultCardProps {
  profile: ProfileSearchResult;
}

export function SearchResultCard({ profile }: SearchResultCardProps) {
  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getInitials = (name: string) =>
    name
      .split(/[_\s-]/)
      .map((segment) => segment[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <Link
      to={`/profile/${profile.address}`}
      className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardContent className="flex items-center gap-4 py-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={profile.avatarUrl || undefined} alt={profile.username} />
            <AvatarFallback>
              {profile.avatarUrl ? (
                <User className="h-5 w-5" />
              ) : (
                getInitials(profile.username)
              )}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">{profile.username}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatAddress(profile.address)}
              </span>
            </div>
            {profile.bio && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {profile.bio}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
