# ChainVoice Contracts Deployment Guide

## Prerequisites
- Node.js 18+
- Stacks wallet with STX
- Private key for deployment

## Testnet Deployment

### 1. Setup Environment
```bash
npm install
cp .env.testnet.example .env.testnet
```

### 2. Configure Private Key
Edit .env.testnet and add your testnet private key:
```
DEPLOYER_KEY=your_testnet_private_key
```

Get testnet STX from faucet: https://explorer.hiro.so/sandbox/faucet

### 3. Run Tests
```bash
npm run test
```

### 4. Deploy to Testnet
```bash
npm run deploy:testnet
```

This will deploy both contracts:
1. profiles.clar
2. messages.clar (after 30 second delay)

### 5. Verify Deployment
Check transactions on testnet explorer:
https://explorer.hiro.so/?chain=testnet

## Mainnet Deployment

### 1. Setup Environment
```bash
cp .env.mainnet.example .env.mainnet
```

### 2. Configure Private Key
Edit .env.mainnet and add your mainnet private key:
```
DEPLOYER_KEY=your_mainnet_private_key
```

Ensure wallet has sufficient STX for deployment fees.

### 3. Final Testing
```bash
npm run test
```

### 4. Deploy to Mainnet
```bash
npm run deploy:mainnet
```

WARNING: This consumes real STX and deploys to production.

### 5. Verify Deployment
Check transactions on mainnet explorer:
https://explorer.hiro.so/

## Contract Addresses

After deployment, note your contract addresses:

Testnet:
- profiles: [YOUR_ADDRESS].profiles
- messages: [YOUR_ADDRESS].messages

Mainnet:
- profiles: [YOUR_ADDRESS].profiles
- messages: [YOUR_ADDRESS].messages

## Post-Deployment

1. Test contract functions via explorer
2. Update frontend configuration with contract addresses
3. Monitor transactions for any issues

## Troubleshooting

### Deployment Fails
- Check STX balance
- Verify private key format
- Check network connectivity
- Review transaction in explorer

### Contract Not Found
- Wait for blockchain confirmation
- Check transaction status
- Verify contract name matches

## Gas Fees

Testnet: Free (use faucet)
Mainnet: Variable based on network congestion
