interface HamburgerIconProps {
  open: boolean;
  className?: string;
}

/**
 * Animated hamburger-to-X icon. Uses three horizontal bars that
 * rotate and translate into an X shape when `open` is true.
 *
 * Built with plain divs rather than importing an icon library so the
 * animation between states feels intentional and smooth.
 */
export function HamburgerIcon({ open, className = '' }: HamburgerIconProps) {
  const barBase =
    'block h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ease-in-out';

  return (
    <div className={`flex flex-col justify-center items-center gap-[5px] ${className}`}>
      <span
        className={`${barBase} ${open ? 'translate-y-[7px] rotate-45' : ''}`}
      />
      <span
        className={`${barBase} ${open ? 'opacity-0 scale-x-0' : ''}`}
      />
      <span
        className={`${barBase} ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
      />
    </div>
  );
}
