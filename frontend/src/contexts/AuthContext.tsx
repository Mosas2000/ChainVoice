import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { userSession, isAuthenticated, getUserAddress, connectWallet, disconnectWallet } from '../services/auth';

/**
 * Shape of the authentication context available to all consumers.
 *
 * The provider manages wallet connection lifecycle, pending sign-in
 * handling, and exposes loading / error states so the UI can show
 * appropriate feedback at every stage.
 */
interface AuthContextType {
  /** Whether the user has an active Stacks session. */
  isAuthenticated: boolean;
  /** The user's STX address (mainnet or testnet) or `null` when signed out. */
  userAddress: string | null;
  /** `true` while the wallet-connect popup is open and awaiting a response. */
  connecting: boolean;
  /** Human-readable error string if the last connection attempt failed. Auto-clears after 10 s. */
  connectionError: string | null;
  /** `true` until the initial `handlePendingSignIn` check has resolved. */
  initializing: boolean;
  /** Re-read session state from `UserSession` and update the context. */
  checkAuth: () => void;
  /** Open the Stacks wallet popup. Resolves on success, rejects on failure/cancel. */
  connectWallet: () => Promise<void>;
  /** Clear the session and reset context state. */
  disconnectWallet: () => void;
  /** Manually dismiss the connection error banner. */
  clearConnectionError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication state and wallet actions to the component tree.
 *
 * On mount the provider checks for a pending Stacks sign-in redirect.
 * While that check runs the `initializing` flag stays `true` so
 * downstream components can render a skeleton or spinner.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  const checkAuth = useCallback(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) {
      setUserAddress(getUserAddress());
    } else {
      setUserAddress(null);
    }
  }, []);

  const handleConnectWallet = useCallback(async () => {
    setConnecting(true);
    setConnectionError(null);
    try {
      await connectWallet();
      checkAuth();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      setConnectionError(message);
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  }, [checkAuth]);

  const handleDisconnectWallet = useCallback(() => {
    disconnectWallet();
    checkAuth();
  }, [checkAuth]);

  const clearConnectionError = useCallback(() => setConnectionError(null), []);

  // Auto-dismiss the connection error after 10 seconds
  useEffect(() => {
    if (!connectionError) return;
    const timer = setTimeout(() => setConnectionError(null), 10_000);
    return () => clearTimeout(timer);
  }, [connectionError]);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(() => {
        checkAuth();
      }).finally(() => {
        setInitializing(false);
      });
    } else {
      checkAuth();
      setInitializing(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: authenticated, 
      userAddress, 
      connecting,
      connectionError,
      initializing,
      checkAuth,
      connectWallet: handleConnectWallet,
      disconnectWallet: handleDisconnectWallet,
      clearConnectionError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Consume the authentication context.
 *
 * @throws {Error} If called outside of an `AuthProvider`.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
