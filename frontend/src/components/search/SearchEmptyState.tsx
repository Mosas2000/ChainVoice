import { SearchX } from 'lucide-react';

interface SearchEmptyStateProps {
  query: string;
}

/**
 * Shown when a search completes successfully but returns zero results.
 * Displays the query string back to the user so they can see exactly
 * what was searched and decide how to refine it.
 */
export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="text-center py-8 space-y-3">
      <SearchX className="h-10 w-10 mx-auto text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium">No users found</p>
        <p className="text-xs text-muted-foreground">
          No profiles matching "<span className="font-medium">{query}</span>" were found.
          Try a different username or address.
        </p>
      </div>
    </div>
  );
}
