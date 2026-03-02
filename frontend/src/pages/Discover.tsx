import { useSearch } from '@/hooks/useSearch';
import {
  SearchInput,
  SearchResultCard,
  SearchResultSkeleton,
  SearchEmptyState,
} from '@/components/search';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp } from 'lucide-react';

export function Discover() {
  const { query, setQuery, results, loading, error, hasSearched, clear } =
    useSearch({ minChars: 2 });

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Discover</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Search for users by username or Stacks address
          </p>
        </div>

        {/* Search input */}
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={clear}
          loading={loading}
          autoFocus
        />

        {/* Search results */}
        <div aria-live="polite" aria-atomic="true">
          {error && (
            <div role="alert" className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {loading && <SearchResultSkeleton />}

          {!loading && hasSearched && results.length === 0 && (
            <SearchEmptyState query={query} />
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {results.length} {results.length === 1 ? 'result' : 'results'} found
              </p>
              {results.map((profile) => (
                <SearchResultCard key={profile.address} profile={profile} query={query} />
              ))}
            </div>
          )}
        </div>

        {/* Discovery prompt — shown before the user has typed anything */}
        {!hasSearched && !loading && query.length === 0 && (
          <div className="space-y-4 pt-4">
            <Card>
              <CardContent className="flex items-start gap-4 py-5">
                <Users className="h-8 w-8 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold mb-1">Find people on ChainVoice</h3>
                  <p className="text-xs text-muted-foreground">
                    Type at least 2 characters to search for users by their
                    username, bio, or Stacks wallet address.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-4 py-5">
                <TrendingUp className="h-8 w-8 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold mb-1">Explore the community</h3>
                  <p className="text-xs text-muted-foreground">
                    Discover new voices, follow users whose posts interest you,
                    and grow your decentralised social network.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
