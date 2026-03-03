import { XCircle } from 'lucide-react';

interface FieldErrorProps {
  /** The error message to display, or null/undefined when valid. */
  message: string | null | undefined;
  /** HTML id — wire this to aria-describedby on the associated input. */
  id?: string;
}

/**
 * Inline field error message displayed below form inputs.
 *
 * Renders nothing when `message` is falsy so it can be used
 * unconditionally without wrapping in a ternary.
 */
export function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="text-xs text-destructive flex items-center gap-1 mt-1"
    >
      <XCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}
