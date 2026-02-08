import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { APP_DETAILS } from '../config/contracts';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const connectWallet = () => {
  showConnect({
    appDetails: APP_DETAILS,
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession,
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
