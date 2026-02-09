import { makeContractCall, broadcastTransaction, AnchorMode, stringAsciiCV, stringUtf8CV } from '@stacks/transactions';
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
    if (config.deployer.mnemonic && config.deployer.mnemonic !== 'your twelve or twenty four word mnemonic phrase here') {
        const accountIndex = 0;
        const wallet = await generateWallet({
            secretKey: config.deployer.mnemonic,
            password: '',
        });
        const account = wallet.accounts[accountIndex];
        const address = getStxAddress({ account, network: 'mainnet' });
        console.log(`Using account ${accountIndex}: ${address}\n`);
        return account.stxPrivateKey;
    }

    const privateKey = config.deployer.private_key;
    if (!privateKey || privateKey === 'your_mainnet_private_key_here') {
        console.error('No valid deployer credentials found');
        process.exit(1);
    }
    return privateKey;
}

async function testCreateProfileAndPost() {
    const senderKey = await getDeployerKey();
    
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   ChainVoice Batch: Create Profile and Post              ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: 'chainvoice-batch',
        functionName: 'create-profile-and-post',
        functionArgs: [
            stringAsciiCV('mosascreativity'),
            stringAsciiCV('Blockchain developer | Building on Stacks | ChainVoice creator 🚀'),
            stringAsciiCV('https://avatars.githubusercontent.com/mosas'),
            stringUtf8CV('🎉 Hello ChainVoice! Testing the batch contract for the first time on mainnet. This creates my profile AND posts a message in one transaction!')
        ],
        senderKey,
        network,
        anchorMode: AnchorMode.Any,
        fee: 15000, // 0.015 STX
    };

    try {
        console.log('Creating transaction...');
        const transaction = await makeContractCall(txOptions);
        
        console.log('Broadcasting...');
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        console.log('\nResponse:', JSON.stringify(broadcastResponse, null, 2));

        if ('error' in broadcastResponse) {
            console.error('\n❌ Failed:', (broadcastResponse as any).reason);
            return null;
        }

        console.log('\n✅ Success!');
        console.log('Transaction ID:', broadcastResponse.txid);
        console.log('Explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}`);
        console.log('\nThis transaction will:');
        console.log('  1. Create your profile');
        console.log('  2. Post your first message');
        console.log('\nAll in a single on-chain transaction! 🎯\n');
        
        return broadcastResponse.txid;
    } catch (error) {
        console.error('\n❌ Error:', error);
        return null;
    }
}

testCreateProfileAndPost();
