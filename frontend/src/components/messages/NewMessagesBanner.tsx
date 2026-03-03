import { Button } from '@/components/ui/button';
import { ArrowUp, X } from 'lucide-react';

interface NewMessagesBannerProps {
  count: number;
  onLoad: () => void;
  onDismiss: () => void;
}

/**
 * A sticky banner that appears at the top of the feed when new
 * messages are detected by the polling loop.
 *
 * The user can click the banner to load the new messages, or
 * dismiss it with the close button.
 */
export function NewMessagesBanner({ count, onLoad, onDismiss }: NewMessagesBannerProps) {
  if (count <= 0) return null;

  const label = count === 1 ? '1 new message' : `${count} new messages`;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-between gap-3 rounded-lg border bg-primary/5 px-4 py-2 text-sm"
    >
      <button
        type="button"
        onClick={onLoad}
        className="flex items-center gap-2 font-medium text-primary hover:underline"
      >
        <ArrowUp className="h-4 w-4" />
        {label}
      </button>  

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={onDismiss}
        aria-label="Dismiss new messages notification"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
