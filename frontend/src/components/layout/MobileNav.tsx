import { useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Home, Rss, User, LogOut, Wallet } from 'lucide-react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/feed', label: 'Feed', icon: Rss },
  { to: '/profile', label: 'Profile', icon: User },
] as const;

export function MobileNav({ open, onClose }: MobileNavProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const { isAuthenticated, userAddress, connectWallet, disconnectWallet } = useAuth();

  // Lock body scroll while drawer is visible
  useLockBodyScroll(open);

  // Trap focus inside the drawer for keyboard accessibility
  useFocusTrap(drawerRef, open, onClose);

  // Close when tapping outside the drawer panel
  useOnClickOutside(drawerRef, onClose, open);

  const handleNavClick = useCallback(() => {
    // Small delay so the route transition starts before the drawer
    // animates closed, avoiding a visual jump
    requestAnimationFrame(() => onClose());
  }, [onClose]);

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`
          fixed top-0 right-0 z-50 h-full w-72 max-w-[80vw]
          bg-background border-l shadow-xl
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-4 h-16 border-b">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="h-5 w-5" aria-hidden="true" />
              <span className="font-semibold">ChainVoice</span>
            </div>
            <ThemeToggle />
          </div>

          {/* Navigation links */}
          <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                const isActive = pathname === to;
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={handleNavClick}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
                        transition-colors
                        ${isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer / wallet area */}
          <div className="border-t p-4 space-y-3">
            {isAuthenticated && userAddress ? (
              <>
                <div className="flex items-center gap-2 px-1">
                  <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">
                    {formatAddress(userAddress)}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    disconnectWallet();
                    onClose();
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  aria-label="Disconnect wallet"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  connectWallet();
                  onClose();
                }}
                size="sm"
                className="w-full"
                aria-label="Connect your Stacks wallet"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
