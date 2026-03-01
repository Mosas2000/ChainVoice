import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  showIcon?: boolean;
  /** Accessible name — defaults to "opens in a new tab" suffix */
  label?: string;
  children: React.ReactNode;
}

/**
 * Wrapper for outbound links.
 * Adds target="_blank", rel="noopener noreferrer", and an optional trailing icon.
 */
export function ExternalLink({
  href,
  showIcon = false,
  label,
  className,
  children,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label ? `${label} (opens in a new tab)` : undefined}
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    >
      {children}
      {showIcon && <ExternalLinkIcon className="h-3 w-3 shrink-0" aria-hidden="true" />}
    </a>
  );
}
