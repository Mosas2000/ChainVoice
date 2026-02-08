import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
          <Link to="/" className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">ChainVoice</span>
          </Link>
          {isAuthenticated && (
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/feed"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Feed
              </Link>
              <Link
                to="/profile"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Profile
              </Link>
            </nav>
          )}
        </div>

        <div>
          {isAuthenticated && userAddress ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {formatAddress(userAddress)}
              </span>
              <Button onClick={disconnectWallet} variant="outline" size="sm">
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} size="sm">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
