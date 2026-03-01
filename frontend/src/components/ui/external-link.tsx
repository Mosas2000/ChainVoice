import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  showIcon?: boolean;
  children: React.ReactNode;
}

/**
 * Wrapper for outbound links.
 * Adds target="_blank", rel="noopener noreferrer", and an optional trailing icon.
 */
export function ExternalLink({
  href,
  showIcon = false,
  className,
  children,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    >
      {children}
      {showIcon && <ExternalLinkIcon className="h-3 w-3 shrink-0" aria-hidden="true" />}
    </a>
  );
}
