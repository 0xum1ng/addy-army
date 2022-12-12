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

  console.log("Creating Proposals...")

  const creatorWallet = Helper.getWallet(MNEMONIC!, 0)
  const client = new snapshot.Client712(HUB)

  // Iterate dates to create proposal for each day
  const startDate = "2022-07-30"
  const voteStartDate = "2022-07-02"
  for (let dateInc = 1; dateInc <= 1000 ; dateInc++) {
    // get date string
    let date = new Date(startDate)
    date.setDate(date.getDate() + dateInc)
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getUTCDate()
    const year = date.getUTCFullYear()
    const dateString = month + " " + day + " " + year + " 00:00:00 UTC"

    // generate random eth price
    const ethPrice = Helper.randNum(300, 4000)

    // create proposal
    const title = "Will ETH close above or below " + ethPrice + " USD at " + dateString
    const proposalEndTime = Math.floor(date.getTime() / 1000)
    const proposalStartTime = new Date(voteStartDate).getTime() / 1000
    console.log("creating proposal: " + title)

    let proposalId
    try {
      const receipt: any = await client.proposal(creatorWallet, creatorWallet.address, {
        space: 'bytedust.eth',
        type: 'single-choice',
        title: title,
        body: '',
        discussion: '',
        choices: ['Yes', 'No'],
        start: proposalStartTime,
        end: proposalEndTime,
        snapshot: 13620822,
        plugins: JSON.stringify({})
      })

      if ('id' in receipt) {
          proposalId = receipt.id
          console.log("created proposal: " + receipt.id)
      } else {
          throw new Error("Proposal creation failed");
      }

      // Iterate accounts to vote
      console.log("voting...")
      const numVoters = Helper.randNum(1000, 10000)
      for (let i=0; i <= numVoters; i++) {
          const wallet = Helper.getWallet(MNEMONIC!, i)
          try {
            const receipt = await client.vote(wallet, wallet.address, {
              space: 'bytedust.eth',
              proposal: proposalId,
              type: 'single-choice',
              choice: Helper.randNum(1, 2)
            })
            console.log("account " + i + " voted")
          } catch (e) {
            console.log(e)
          }
      }
    } catch (e) {
      console.log(e)
    }
  }
}

main()
