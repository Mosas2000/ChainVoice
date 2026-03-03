import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { userSession, isAuthenticated, getUserAddress, connectWallet, disconnectWallet } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userAddress: string | null;
  connecting: boolean;
  connectionError: string | null;
  clearConnectionError: () => void;
  checkAuth: () => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

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
      console.error('Wallet connection failed:', message);
    } finally {
      setConnecting(false);
    }
  }, [checkAuth]);

  const clearConnectionError = useCallback(() => {
    setConnectionError(null);
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    disconnectWallet();
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn()
        .then(() => {
          checkAuth();
        })
        .catch((err) => {
          console.error('Failed to complete pending sign-in:', err);
          setConnectionError('Failed to complete wallet connection. Please try again.');
        });
    } else {
      checkAuth();
    }
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: authenticated, 
      userAddress,
      connecting,
      connectionError,
      clearConnectionError,
      checkAuth,
      connectWallet: handleConnectWallet,
      disconnectWallet: handleDisconnectWallet
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
