import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';

const mnemonic = "glue into gate this better involve alarm beyond dance control heavy party penalty avoid affair memory idle horror exotic slam odor caught ocean host";
const target = "SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T";

async function checkAccounts() {
    const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
    
    console.log("Checking first 10 accounts for target:", target);
    console.log();
    
    for (let i = 0; i < 10; i++) {
        const account = wallet.accounts[i];
        const address = getStxAddress({ account, network: 'mainnet' });
        const match = address === target ? " ✅ MATCH!" : "";
        console.log(`Account ${i}: ${address}${match}`);
    }
}

checkAccounts();
