import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { userSession, isAuthenticated, getUserAddress, connectWallet, disconnectWallet } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userAddress: string | null;
  connecting: boolean;
  checkAuth: () => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

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
    try {
      await connectWallet();
      checkAuth();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    checkAuth();
  };

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
