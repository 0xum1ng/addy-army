import * as dotenv from "dotenv"
import { BigNumber, ethers, Wallet } from "ethers"
import { Helper } from "../helper"
import snapshot from "@snapshot-labs/snapshot.js"

dotenv.config()
const MNEMONIC = process.env.MNEMONIC
const RPC = "https://rpc.ankr.com/arbitrum"
const HUB = "https://hub.snapshot.org"

async function main() {
  const client = new snapshot.Client712(HUB)

  // Iterate accounts to vote
  console.log("voting...")
  const proposalId = "0x6257bef302ae615a1951f17244691d04e9f958e0f27dff5ec0833d06ae4d9772"
  let i = 4079
  const numVoters = 10000
  for (; i <= numVoters; i++) {
      const wallet = Helper.getWallet(MNEMONIC!, i)
      try {
        const receipt = await client.vote(wallet, wallet.address, {
          space: 'zksyncdao.eth',
          proposal: proposalId,
          type: 'single-choice',
          choice: 1
        })
        console.log("account " + i + " voted")
        await Helper.sleep(Helper.randNum(1, 10))
      } catch (e) {
        console.log(e)
      }
  }
}

main()
