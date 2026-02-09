import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const NETWORK = import.meta.env.VITE_NETWORK || 'testnet';

const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

export const CONTRACTS = {
  profiles: {
    address: import.meta.env.VITE_PROFILES_CONTRACT_ADDRESS || '',
    name: import.meta.env.VITE_PROFILES_CONTRACT_NAME || 'profiles',
  },
  messages: {
    address: import.meta.env.VITE_MESSAGES_CONTRACT_ADDRESS || '',
    name: import.meta.env.VITE_MESSAGES_CONTRACT_NAME || 'messages',
  },
  batch: {
    address: import.meta.env.VITE_BATCH_CONTRACT_ADDRESS || '',
    name: import.meta.env.VITE_BATCH_CONTRACT_NAME || 'chainvoice-batch',
  },
  network,
};

export const APP_DETAILS = {
  name: 'ChainVoice',
  icon: window.location.origin + '/logo.svg',
};
