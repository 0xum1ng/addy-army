import * as dotenv from "dotenv"
import { BigNumber, ethers, Wallet } from "ethers"
import { Helper } from "../helper"
import snapshot from "@snapshot-labs/snapshot.js"

dotenv.config()
const MNEMONIC = process.env.MNEMONIC
const RPC = "https://rpc.ankr.com/arbitrum"
const HUB = "https://hub.snapshot.org"

async function main() {
  const provider = Helper.getProvider(RPC)
  const client = new snapshot.Client712(HUB)

  console.log("Joining...")

  for (let i=65051; i <= 100000; i++) {
    try {
      const wallet = Helper.getWallet(MNEMONIC!, i)
      const receipt = await client.follow(wallet, wallet.address, {
        space: 'bytedust.eth'
      })
      console.log("account " + i + " joined")
    } catch (e) {
      console.log(e)
    }
  }
}

main()
