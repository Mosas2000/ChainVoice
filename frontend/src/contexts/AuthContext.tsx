import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { userSession, isAuthenticated, getUserAddress, connectWallet, disconnectWallet } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userAddress: string | null;
  connecting: boolean;
  connectionError: string | null;
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

  const checkAuth = () => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) {
      setUserAddress(getUserAddress());
    } else {
      setUserAddress(null);
    }
  };

  const handleConnectWallet = async () => {
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
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    checkAuth();
  };

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
      });
    } else {
      checkAuth();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: authenticated, 
      userAddress, 
      connecting,
      connectionError,
      checkAuth,
      connectWallet: handleConnectWallet,
      disconnectWallet: handleDisconnectWallet,
      clearConnectionError: () => setConnectionError(null),
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
