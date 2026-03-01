import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export function Header() {
  const { isAuthenticated, userAddress, connectWallet, disconnectWallet } = useAuth();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2" aria-label="ChainVoice home">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">ChainVoice</span>
          </Link>
          {isAuthenticated && (
            <nav aria-label="Main navigation" className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Home
              </Link>
              <Link
                to="/feed"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Feed
              </Link>
              <Link
                to="/profile"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Profile
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated && userAddress ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {formatAddress(userAddress)}
              </span>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                size="sm"
                aria-label="Disconnect wallet"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} size="sm" aria-label="Connect your Stacks wallet">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
