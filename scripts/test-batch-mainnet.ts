import { makeContractCall, broadcastTransaction, AnchorMode, stringAsciiCV, stringUtf8CV, listCV, principalCV, uintCV } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';
import { parse } from '@iarna/toml';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';

const configPath = 'settings/Mainnet.toml';
const configFile = readFileSync(configPath, 'utf-8');
const config: any = parse(configFile);
const network = STACKS_MAINNET;

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'chainvoice-batch';

async function getDeployerKey(): Promise<string> {
    if (config.deployer.mnemonic && config.deployer.mnemonic !== 'your twelve or twenty four word mnemonic phrase here') {
        const accountIndex = 0; // Force account 0 to match contract deployer
        const wallet = await generateWallet({
            secretKey: config.deployer.mnemonic,
            password: '',
        });
        const account = wallet.accounts[accountIndex];
        const address = getStxAddress({ account, network: 'mainnet' });
        console.log(`Using account ${accountIndex}: ${address}\n`);
        
        if (address !== CONTRACT_ADDRESS) {
            console.error(`ERROR: Account mismatch!`);
            console.error(`Expected: ${CONTRACT_ADDRESS}`);
            console.error(`Got: ${address}`);
            console.error(`Make sure you're using the same mnemonic and account that deployed the contracts.`);
            process.exit(1);
        }
        
        return account.stxPrivateKey;
    }

    const privateKey = config.deployer.private_key;
    if (!privateKey || privateKey === 'your_mainnet_private_key_here') {
        console.error('No valid deployer credentials found');
        process.exit(1);
    }
    return privateKey;
}

async function testFollowMultipleUsers() {
    const senderKey = await getDeployerKey();
    
    console.log('='.repeat(60));
    console.log('TEST 1: Follow Multiple Users');
    console.log('='.repeat(60));

    // Test accounts to follow
    const usersToFollow = [
        'SP3382F8A75J4XF2VVNHTFTRZ0MNDX9J97P2WCAH6',
        'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
        'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE'
    ];

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'follow-multiple-users',
        functionArgs: [
            listCV(usersToFollow.map(addr => principalCV(addr)))
        ],
        senderKey,
        network,
        anchorMode: AnchorMode.Any,
        fee: 10000, // 0.01 STX
    };

    try {
        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        console.log('Response:', JSON.stringify(broadcastResponse, null, 2));

        if ('error' in broadcastResponse) {
            console.error('❌ Failed:', (broadcastResponse as any).reason);
            return null;
        }

        console.log('✅ Success! Following multiple users');
        console.log('Transaction ID:', broadcastResponse.txid);
        console.log('Explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}`);
        return broadcastResponse.txid;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function testPostThread() {
    const senderKey = await getDeployerKey();
    
    console.log('\n');
    console.log('='.repeat(60));
    console.log('TEST 2: Post Thread (Multiple Messages)');
    console.log('='.repeat(60));

    const threadMessages = [
        'Thread 1/3: Testing ChainVoice batch contract! 🚀',
        'Thread 2/3: This allows posting multiple messages in one transaction.',
        'Thread 3/3: Much more efficient than individual posts! #ChainVoice'
    ];

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'post-thread',
        functionArgs: [
            listCV(threadMessages.map(msg => stringUtf8CV(msg)))
        ],
        senderKey,
        network,
        anchorMode: AnchorMode.Any,
        fee: 15000, // 0.015 STX
    };

    try {
        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        console.log('Response:', JSON.stringify(broadcastResponse, null, 2));

        if ('error' in broadcastResponse) {
            console.error('❌ Failed:', (broadcastResponse as any).reason);
            return null;
        }

        console.log('✅ Success! Posted thread with', threadMessages.length, 'messages');
        console.log('Transaction ID:', broadcastResponse.txid);
        console.log('Explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}`);
        return broadcastResponse.txid;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function testReactToMultiple() {
    const senderKey = await getDeployerKey();
    
    console.log('\n');
    console.log('='.repeat(60));
    console.log('TEST 3: React to Multiple Messages');
    console.log('='.repeat(60));

    // Message IDs to react to (use actual message IDs from your contract)
    const messageIds = [1, 2, 3];

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'react-to-multiple',
        functionArgs: [
            listCV(messageIds.map(id => uintCV(id))),
            stringAsciiCV('👍')
        ],
        senderKey,
        network,
        anchorMode: AnchorMode.Any,
        fee: 15000, // 0.015 STX
    };

    try {
        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        console.log('Response:', JSON.stringify(broadcastResponse, null, 2));

        if ('error' in broadcastResponse) {
            console.error('❌ Failed:', (broadcastResponse as any).reason);
            return null;
        }

        console.log('✅ Success! Reacted to', messageIds.length, 'messages');
        console.log('Transaction ID:', broadcastResponse.txid);
        console.log('Explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}`);
        return broadcastResponse.txid;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function testUpdateProfileAndAnnounce() {
    const senderKey = await getDeployerKey();
    
    console.log('\n');
    console.log('='.repeat(60));
    console.log('TEST 4: Update Profile and Announce');
    console.log('='.repeat(60));

    const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'update-profile-and-announce',
        functionArgs: [
            stringAsciiCV('mosascreativity'),
            stringAsciiCV('Testing ChainVoice batch operations on mainnet! 🎯'),
            stringAsciiCV('https://avatar.example.com/mosas.jpg'),
            stringUtf8CV('🎉 Successfully testing the batch contract! All functions working perfectly on mainnet.')
        ],
        senderKey,
        network,
        anchorMode: AnchorMode.Any,
        fee: 12000, // 0.012 STX
    };

    try {
        const transaction = await makeContractCall(txOptions);
        const broadcastResponse = await broadcastTransaction({ transaction, network });

        console.log('Response:', JSON.stringify(broadcastResponse, null, 2));

        if ('error' in broadcastResponse) {
            console.error('❌ Failed:', (broadcastResponse as any).reason);
            return null;
        }

        console.log('✅ Success! Updated profile and posted announcement');
        console.log('Transaction ID:', broadcastResponse.txid);
        console.log('Explorer:', `https://explorer.hiro.so/txid/${broadcastResponse.txid}`);
        return broadcastResponse.txid;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function runAllTests() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   ChainVoice Batch Contract - Mainnet Integration Tests   ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log();
    console.log('Contract:', `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
    console.log('Network: Mainnet');
    console.log();

    const results = [];

    // Test 1: Follow multiple users
    const test1 = await testFollowMultipleUsers();
    results.push({ test: 'Follow Multiple Users', txid: test1 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test 2: Post thread
    const test2 = await testPostThread();
    results.push({ test: 'Post Thread', txid: test2 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test 3: React to multiple
    const test3 = await testReactToMultiple();
    results.push({ test: 'React to Multiple', txid: test3 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test 4: Update profile and announce
    const test4 = await testUpdateProfileAndAnnounce();
    results.push({ test: 'Update Profile & Announce', txid: test4 });

    // Summary
    console.log('\n');
    console.log('='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    results.forEach((result, index) => {
        const status = result.txid ? '✅' : '❌';
        console.log(`${status} Test ${index + 1}: ${result.test}`);
        if (result.txid) {
            console.log(`   TxID: ${result.txid}`);
        }
    });
    console.log('='.repeat(60));
}

runAllTests();
