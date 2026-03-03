import { X, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';
import type { ToastVariant } from '@/contexts/ToastContext';

interface ToastItemProps {
  title: string;
  description?: string;
  variant: ToastVariant;
  onDismiss: () => void;
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  default: 'border-border bg-background text-foreground',
  success: 'border-green-500/30 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100',
  error: 'border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/20',
  loading: 'border-primary/30 bg-primary/5 text-foreground',
};

function VariantIcon({ variant }: { variant: ToastVariant }) {
  switch (variant) {
    case 'success':
      return <CheckCircle className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />;
    case 'loading':
      return <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden="true" />;
    default:
      return <Info className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />;
  }
}

export function ToastItem({ title, description, variant, onDismiss }: ToastItemProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg ' +
        'animate-in slide-in-from-right-full duration-300 ' +
        VARIANT_STYLES[variant]
      }
    >
      <VariantIcon variant={variant} />

      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
