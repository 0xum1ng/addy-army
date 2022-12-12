import * as dotenv from "dotenv";
import { BigNumber, ethers, Wallet } from "ethers";
import { Helper } from "../helper";
import CurveStethPoolABI from "../abis/CurveStETHPool.json";
import ERC20 from "../abis/ERC20.json";


dotenv.config()
const MNEMONIC = process.env.MNEMONIC
const RPC = "https://mainnet.ethereumpow.org"
const CURVE_STETH_POOL_ADDR = "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022"
const STETH_ADDR = "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"

async function main() {
  const provider = Helper.getProvider(RPC!)

  console.log("Swapping steth to eth on curve...")

  const currentWallet = Helper.getWallet(MNEMONIC!, 0)
  const currentSigner = Helper.getSigner(provider, currentWallet)
  const CurveStethPoolContract = new ethers.Contract(CURVE_STETH_POOL_ADDR, CurveStethPoolABI, currentSigner);
  const Steth = new ethers.Contract(STETH_ADDR, ERC20, currentSigner);

  console.log("\n==============================")
  console.log("swap account: " + currentWallet.address)
  console.log("eth in pool: " + ethers.utils.formatEther(await provider.getBalance(CURVE_STETH_POOL_ADDR)))
  console.log("steth in pool: " + ethers.utils.formatEther(await Steth.balanceOf(CURVE_STETH_POOL_ADDR)))
  console.log("eth balance before transfer: " + ethers.utils.formatEther(await provider.getBalance(currentWallet.address)))
  console.log("steth balance before transfer: " + ethers.utils.formatEther(await Steth.balanceOf(currentWallet.address)))

  const stethAmount = "2605346343188232920330"
  const transaction = await CurveStethPoolContract.exchange(
    "1",
    "0",
    stethAmount,
    "0",
    { value: "0", gasLimit: "5000000", gasPrice: "10000000000" }
  )
  console.log("tx: " + transaction.hash)
  await transaction.wait()

  console.log("balance after transfer: " + ethers.utils.formatEther(await provider.getBalance(currentWallet.address)))
}

main();
