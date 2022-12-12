import * as dotenv from "dotenv";
import { BigNumber, ethers, Wallet } from "ethers";
import { Helper } from "../helper";


dotenv.config()
const MNEMONIC = process.env.MNEMONIC
const RPC = "https://optimism-mainnet.public.blastapi.io"

async function main() {
  const provider = Helper.getProvider(RPC!)
  const seeder = Helper.getWallet(MNEMONIC!, 0)
  const seederSigner = Helper.getSigner(provider, seeder)

  console.log("Seeding Accounts...")

  // Seeded up to accounts between 1 - 995
  for (let i=476; i <= 995; i++) {
    const currentWallet = Helper.getWallet(MNEMONIC!, i)
    console.log("\n==============================")
    console.log("seeder balance: " + ethers.utils.formatEther(await provider.getBalance(seeder.address)))
    console.log("seeding account " + String(i) + ": " + currentWallet.address)
    console.log("current balance: " + ethers.utils.formatEther(await provider.getBalance(currentWallet.address)))

    // seed account
    const sendETH = {
      to: currentWallet.address,
      value: ethers.utils.parseEther('0.008')
    }
    const transaction = await seederSigner.sendTransaction(sendETH);
    console.log("tx: " + transaction.hash)
    await transaction.wait()

    console.log("seeded balance: " + ethers.utils.formatEther(await provider.getBalance(currentWallet.address)))
  }
}

main();
