import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.mainnet' });

const network = new StacksMainnet();

async function deployContract(contractName: string, contractPath: string) {
  const deployerKey = process.env.DEPLOYER_KEY;
  
  if (!deployerKey) {
    console.error('DEPLOYER_KEY not found in .env.mainnet');
    process.exit(1);
  }

  const contractCode = readFileSync(contractPath, 'utf-8');
  
  console.log(`Deploying ${contractName} to mainnet...`);
  console.log('WARNING: This will deploy to MAINNET and consume real STX!');
  console.log('Contract:', contractName);
  
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
    
    console.log(`${contractName} deployed successfully to mainnet`);
    console.log('Transaction ID:', broadcastResponse.txid);
    console.log('Check status: https://explorer.hiro.so/txid/' + broadcastResponse.txid);
    
    return broadcastResponse.txid;
  } catch (error) {
    console.error(`Mainnet deployment of ${contractName} failed:`, error);
    throw error;
  }
}

async function deployAll() {
  console.log('='.repeat(60));
  console.log('MAINNET DEPLOYMENT');
  console.log('='.repeat(60));
  console.log('This will deploy contracts to MAINNET using real STX.');
  console.log('Make sure you have sufficient STX for deployment fees.');
  console.log('='.repeat(60));
  console.log('\n');
  
  await deployContract('profiles', 'contracts/profiles.clar');
  
  console.log('\nWaiting 60 seconds before deploying messages contract...');
  await new Promise(resolve => setTimeout(resolve, 60000));
  
  await deployContract('messages', 'contracts/messages.clar');
  
  console.log('\n');
  console.log('='.repeat(60));
  console.log('All contracts deployed to MAINNET successfully!');
  console.log('='.repeat(60));
}

deployAll();
