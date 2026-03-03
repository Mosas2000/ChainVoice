import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { APP_DETAILS, NETWORK } from '../config/contracts';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const connectWallet = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      showConnect({
        appDetails: APP_DETAILS,
        redirectTo: '/',
        onFinish: () => {
          resolve();
        },
        onCancel: () => {
          reject(new Error('Wallet connection was cancelled by the user'));
        },
        userSession,
      });
    } catch (err) {
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
