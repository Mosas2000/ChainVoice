import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { readFileSync } from 'fs';
import { parse } from '@iarna/toml';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';

const configPath = 'settings/Testnet.toml';
const configFile = readFileSync(configPath, 'utf-8');
const config: any = parse(configFile);

const network = new StacksTestnet();
network.coreApiUrl = config.network.node_url;

function getDeployerKey(): string {
  // Check if mnemonic is provided
  if (config.deployer.mnemonic && config.deployer.mnemonic !== 'your twelve or twenty four word mnemonic phrase here') {
    const accountIndex = config.deployer.account_index || 0;
    const wallet = generateWallet({
      secretKey: config.deployer.mnemonic,
      password: '',
    });
    const account = wallet.accounts[accountIndex];
    console.log(`Using mnemonic (account ${accountIndex})`);
    console.log(`Address: ${getStxAddress({ account, network })}\n`);
    return account.stxPrivateKey;
  }
  
  // Fall back to private key
  const privateKey = config.deployer.private_key;
  if (!privateKey || privateKey === 'your_testnet_private_key_here') {
    console.error('No valid deployer credentials found in settings/Testnet.toml');
    console.error('Please provide either:');
    console.error('  - private_key, or');
    console.error('  - mnemonic (and optionally account_index)');
    process.exit(1);
  }
  
  return privateKey;
}

const deployerKey = getDeployerKey();

async function deployContract(contractName: string, contractPath: string) {

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
  console.log(`Network: ${config.network.name}`);
  console.log(`Node URL: ${config.network.node_url}\n`);
  
  await deployContract(config.contracts.profiles, 'contracts/profiles.clar');
  
  const delay = config.deployment.delay_between_contracts;
  console.log(`\nWaiting ${delay / 1000} seconds before deploying messages contract...`);
  await new Promise(resolve => setTimeout(resolve, delay));
  
  await deployContract(config.contracts.messages, 'contracts/messages.clar');
  
  console.log('\nAll contracts deployed to testnet successfully!');
}

deployAll();
