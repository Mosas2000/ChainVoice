import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import { parse } from '@iarna/toml';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';

const configPath = 'settings/Mainnet.toml';
const configFile = readFileSync(configPath, 'utf-8');
const config: any = parse(configFile);
const network = STACKS_MAINNET;

async function getDeployerKey(): Promise<string> {
    if (config.deployer.mnemonic && config.deployer.mnemonic !== 'your twelve or twenty four word mnemonic phrase here') {
        const accountIndex = config.deployer.account_index || 0;
        const wallet = await generateWallet({
            secretKey: config.deployer.mnemonic,
            password: '',
        });
        const account = wallet.accounts[accountIndex];
        console.log(`Using mnemonic (account ${accountIndex})`);
        console.log(`Address: ${getStxAddress({ account, network: 'mainnet' })}\n`);
        return account.stxPrivateKey;
    }

    const privateKey = config.deployer.private_key;
    if (!privateKey || privateKey === 'your_mainnet_private_key_here') {
        console.error('No valid deployer credentials found');
        process.exit(1);
    }
    return privateKey;
}

async function deployBatchContract() {
    const deployerKey = await getDeployerKey();
    const contractCode = readFileSync('contracts/chainvoice-batch.clar', 'utf-8');

    console.log('='.repeat(60));
    console.log('DEPLOYING BATCH CONTRACT TO MAINNET');
    console.log('='.repeat(60));
    console.log('Contract: chainvoice-batch');
    console.log('Size:', (contractCode.length / 1024).toFixed(2), 'KB');
    console.log('Estimated cost: 0.15-0.25 STX');
    console.log('='.repeat(60));
    console.log('\n');

    const txOptions = {
        contractName: 'chainvoice-batch',
        codeBody: contractCode,
        senderKey: deployerKey,
        network,
        anchorMode: AnchorMode.Any,
        fee: 250000, // 0.25 STX - reasonable fee for 5KB contract
    };

    try {
        const transaction = await makeContractDeploy(txOptions);
        console.log('\nBroadcasting transaction...');
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        console.log('\nFull broadcast response:', JSON.stringify(broadcastResponse, null, 2));

        if ('error' in broadcastResponse) {
            console.error('❌ Broadcast error:', (broadcastResponse as any).error);
            console.error('Reason:', (broadcastResponse as any).reason);
            throw new Error((broadcastResponse as any).reason || (broadcastResponse as any).error);
        }

        console.log('✅ chainvoice-batch deployed successfully to mainnet!');
        console.log('Transaction ID:', broadcastResponse.txid);
        console.log('Explorer:', 'https://explorer.hiro.so/txid/' + broadcastResponse.txid);
        console.log('\n');
        console.log('='.repeat(60));
        console.log('DEPLOYMENT COMPLETE');
        console.log('='.repeat(60));
        console.log('Contract address: SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.chainvoice-batch');
        console.log('\nUpdate your .env file:');
        console.log('VITE_BATCH_CONTRACT_ADDRESS=SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T');
        console.log('VITE_BATCH_CONTRACT_NAME=chainvoice-batch');

        return broadcastResponse.txid;
    } catch (error) {
        console.error('Deployment failed:', error);
        throw error;
    }
}

deployBatchContract();
