import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.testnet' });

const network = new StacksTestnet();

async function deployContract(contractName: string, contractPath: string) {
  const deployerKey = process.env.DEPLOYER_KEY;
  
  if (!deployerKey) {
    console.error('DEPLOYER_KEY not found in .env.testnet');
    process.exit(1);
  }

  const contractCode = readFileSync(contractPath, 'utf-8');
  
  console.log(`Deploying ${contractName} to testnet...`);

  const txOptions = {
    contractName,
    codeBody: contractCode,
    senderKey: deployerKey,
    network,
    anchorMode: AnchorMode.Any,
  };

  try {
    const transaction = await makeContractDeploy(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    
    console.log(`${contractName} deployed successfully`);
    console.log('Transaction ID:', broadcastResponse.txid);
    console.log('Check status: https://explorer.hiro.so/txid/' + broadcastResponse.txid + '?chain=testnet');
    
    return broadcastResponse.txid;
  } catch (error) {
    console.error(`Deployment of ${contractName} failed:`, error);
    throw error;
  }
}

async function deployAll() {
  console.log('Starting testnet deployment...\n');
  
  await deployContract('profiles', 'contracts/profiles.clar');
  
  console.log('\nWaiting 30 seconds before deploying messages contract...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  await deployContract('messages', 'contracts/messages.clar');
  
  console.log('\nAll contracts deployed to testnet successfully!');
}

deployAll();
