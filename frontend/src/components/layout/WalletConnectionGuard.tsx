import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wallet } from 'lucide-react';

interface WalletConnectionGuardProps {
  children: React.ReactNode;
  /** Optional short description shown when the user is not connected. */
  message?: string;
}

/**
 * Renders its children only when the wallet is connected.
 *
 * While the auth context is initializing it shows a spinner.
 * If the user is not authenticated it shows a connect prompt.
 */
export function WalletConnectionGuard({
  children,
  message = 'Connect your wallet to continue',
}: WalletConnectionGuardProps) {
  const { isAuthenticated, initializing, connecting, connectWallet } = useAuth();

  if (initializing) {
    return (
      <div className="flex items-center justify-center py-16" aria-busy="true">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto mt-12">
        <CardHeader className="text-center">
          <CardTitle>Wallet Required</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={connectWallet} disabled={connecting}>
            {connecting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4 mr-2" />
            )}
            {connecting ? 'Connecting…' : 'Connect Wallet'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
