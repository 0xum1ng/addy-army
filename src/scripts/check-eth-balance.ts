import * as dotenv from "dotenv";
import { BigNumber, ethers, Wallet } from "ethers";
import { Helper } from "../helper";


dotenv.config()
const MNEMONIC = process.env.MNEMONIC
const RPC = "https://rpc.ankr.com/arbitrum"

async function main() {
  const provider = Helper.getProvider(RPC!)

  console.log("Checking Balances...")

  for (let i=0; i <= 178; i++) {
    const currentWallet = Helper.getWallet(MNEMONIC!, i)
    console.log("\n==============================")
    console.log("checking account " + i)
    console.log("address: " + currentWallet.privateKey)
    console.log("current balance: " + ethers.utils.formatEther(await provider.getBalance(currentWallet.address)))
  }
}

main();
