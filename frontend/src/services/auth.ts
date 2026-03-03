import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { APP_DETAILS, NETWORK } from '../config/contracts';

const appConfig = new AppConfig(['store_write', 'publish_data']);

/** Shared session instance used across the application. */
export const userSession = new UserSession({ appConfig });

/**
 * Maximum time (in ms) the app will wait for the user to finish
 * approving the wallet popup before automatically rejecting.
 */
const WALLET_TIMEOUT_MS = 5 * 60 * 1000;

/**
 * Open the Stacks wallet popup and return a promise that resolves once
 * the user approves the connection, or rejects if they cancel or if the
 * interaction times out.
 *
 * @returns A promise that settles when the wallet interaction completes.
 * @throws {Error} When the popup is cancelled, times out, or fails to open.
 */
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

/**
 * Sign the user out of their wallet session.
 *
 * The previous implementation triggered a hard page reload via
 * `window.location.href`.  This was moved into the calling code
 * (AuthContext) so that callers who don't want a full navigation
 * (e.g. tests) can sign out without side-effects.
 */
export const disconnectWallet = (): void => {
  try {
    userSession.signUserOut();
  } catch {
    // signUserOut may throw if the session is already cleared; ignore.
  }
};

/**
 * Read the signed-in user's STX address.  The address returned will
 * correspond to the currently configured network (mainnet or testnet).
 *
 * @returns The STX address string, or `null` when no user is signed in.
 */
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

/**
 * Check whether a user is currently signed in.  Returns `false` rather
 * than throwing when the session data is corrupted or unreadable.
 */
export const isAuthenticated = (): boolean => {
  try {
    return userSession.isUserSignedIn();
  } catch {
    return false;
  }
};
