import * as dotenv from "dotenv";
import { BigNumber, ethers, Wallet } from "ethers";
import { Helper } from "../helper";
import AcrossBridgeABI from "../abis/AcrossBridge.json";


dotenv.config()
const MNEMONIC = process.env.MNEMONIC
const RPC = "https://optimism-mainnet.public.blastapi.io"
const ACROSS_BRIDGE_ADDR_OP = "0xa420b2d1c0841415A695b81E5B867BCD07Dff8C9"
const WETH_ADDR_OP = "0x4200000000000000000000000000000000000006"

async function main() {
  const provider = Helper.getProvider(RPC!)

  console.log("Bridging from OP to ARB...")

  for (let i=5; i <= 995; i++) {
    const currentWallet = Helper.getWallet(MNEMONIC!, i)
    const currentSigner = Helper.getSigner(provider, currentWallet)
    const AcrossBridgeContract = new ethers.Contract(ACROSS_BRIDGE_ADDR_OP, AcrossBridgeABI, currentSigner);

    console.log("\n==============================")
    console.log("transfer account " + String(i) + ": " + currentWallet.address)
    console.log("balance before transfer: " + ethers.utils.formatEther(await provider.getBalance(currentWallet.address)))

    // bridge
    const amount = "0.004"
    const arbChainId = "42161"
    const options = { value: ethers.utils.parseEther(amount) }
    const transaction = await AcrossBridgeContract.deposit(
      currentWallet.address,
      WETH_ADDR_OP,
      ethers.utils.parseEther(amount),
      arbChainId,
      "1002162546266060", // relayer fee
      String(Helper.getCurrentTimestamp()),
      options
    )
    console.log("tx: " + transaction.hash)
    await transaction.wait()

    console.log("balance after transfer: " + ethers.utils.formatEther(await provider.getBalance(currentWallet.address)))
  }
}

main();
