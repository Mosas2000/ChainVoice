/**
 * Tailwind-aligned responsive breakpoints expressed as CSS media queries.
 *
 * Using constants avoids typos and keeps breakpoints in sync with
 * Tailwind's default theme. The `md` breakpoint (768px) is where the
 * layout shifts from mobile hamburger to full desktop navigation.
 */
export const BREAKPOINTS = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
} as const;
