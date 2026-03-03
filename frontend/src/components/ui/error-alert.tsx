import { AlertTriangle, X } from 'lucide-react';

interface ErrorAlertProps {
  /** The error message to display. */
  message: string;
  /** Optional callback to dismiss the error. Shows an X button when provided. */
  onDismiss?: () => void;
}

/**
 * A styled error banner used to surface contract / API errors
 * inside cards and forms.  Replaces the repeated inline `<div>` +
 * `bg-destructive/15` pattern that was copy-pasted across components.
 */
export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-start gap-2"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 hover:opacity-70"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
