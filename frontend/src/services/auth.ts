import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { APP_DETAILS, NETWORK } from '../config/contracts';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

const WALLET_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes for the user to approve in wallet popup

export const connectWallet = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Wallet connection timed out. Please try again.'));
    }, WALLET_TIMEOUT_MS);

    try {
      showConnect({
        appDetails: APP_DETAILS,
        redirectTo: '/',
        onFinish: () => {
          clearTimeout(timer);
          resolve();
        },
        onCancel: () => {
          clearTimeout(timer);
          reject(new Error('Wallet connection was cancelled by the user'));
        },
        userSession,
      });
    } catch (err) {
      clearTimeout(timer);
      reject(err instanceof Error ? err : new Error('Failed to open wallet connection'));
    }
  });
};

export const disconnectWallet = (): void => {
  try {
    userSession.signUserOut();
  } catch {
    // signUserOut may throw if the session is already cleared; ignore.
  }
  window.location.href = '/';
};

export const getUserAddress = (): string | null => {
  if (userSession.isUserSignedIn()) {
    const userData = userSession.loadUserData();
    const stxAddress = userData.profile.stxAddress;
    // Return the address that matches the configured network so contract
    // calls go to the right chain.
    return NETWORK === 'mainnet'
      ? stxAddress.mainnet
      : stxAddress.testnet || stxAddress.mainnet;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  try {
    return userSession.isUserSignedIn();
  } catch {
    return false;
  }
};
