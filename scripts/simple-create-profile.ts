import { makeContractCall, broadcastTransaction, AnchorMode, stringAsciiCV } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import { parse } from '@iarna/toml';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';

const configPath = 'settings/Mainnet.toml';
const configFile = readFileSync(configPath, 'utf-8');
const config: any = parse(configFile);
const network = STACKS_MAINNET;

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';

async function getDeployerKey(): Promise<string> {
    const accountIndex = 0;
    const wallet = await generateWallet({
        secretKey: config.deployer.mnemonic,
        password: '',
    });
    const account = wallet.accounts[accountIndex];
    console.log(`Address: ${getStxAddress({ account, network: 'mainnet' })}\n`);
    return account.stxPrivateKey;
}

async function createProfile() {
    const senderKey = await getDeployerKey();

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: 'profiles',
        functionName: 'create-profile',
        functionArgs: [
            stringAsciiCV('mosascreativity'),
            stringAsciiCV('Blockchain dev | Building on Stacks | ChainVoice creator 🚀'),
            stringAsciiCV('https://avatars.githubusercontent.com/mosas')
        ],
        senderKey,
        network,
        anchorMode: AnchorMode.Any,
        fee: 10000,
    };

    try {
        const transaction = await makeContractCall(txOptions);
        const response = await broadcastTransaction({ transaction, network });
        
        console.log('Response:', JSON.stringify(response, null, 2));
        console.log('\nTxID:', response.txid);
        console.log('Explorer:', `https://explorer.hiro.so/txid/${response.txid}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

createProfile();
