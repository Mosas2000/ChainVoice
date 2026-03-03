/**
 * A skeleton placeholder rendered in place of the wallet button
 * while the initial authentication check is running.  This prevents
 * the jarring "Connect Wallet" flash before the session is restored.
 */
export function WalletButtonSkeleton() {
  return (
    <div
      className="h-9 w-32 animate-pulse rounded-md bg-muted"
      aria-hidden="true"
    />
  );
}
