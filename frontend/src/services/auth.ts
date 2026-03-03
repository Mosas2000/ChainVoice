import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { APP_DETAILS } from '../config/contracts';

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

export const disconnectWallet = () => {
  userSession.signUserOut();
  window.location.href = '/';
};

export const getUserAddress = (): string | null => {
  if (userSession.isUserSignedIn()) {
    const userData = userSession.loadUserData();
    return userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return userSession.isUserSignedIn();
};
