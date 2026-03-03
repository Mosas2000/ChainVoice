import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { userSession, isAuthenticated, getUserAddress, connectWallet, disconnectWallet } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userAddress: string | null;
  connecting: boolean;
  connectionError: string | null;
  initializing: boolean;
  checkAuth: () => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  clearConnectionError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
