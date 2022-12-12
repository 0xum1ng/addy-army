import * as dotenv from "dotenv"
import { BigNumber, utils, ethers, Wallet } from "ethers"
import axios from "axios";

export class Helper {
  static getProvider(rpc: string) {
    return new ethers.providers.JsonRpcProvider(rpc)
  }

  static getWallet(mnemonic: string, index: number) {
    const basedHDNode = utils.HDNode.fromMnemonic(mnemonic)
    const path = `m/44'/60'/0'/0/` + String(index)
    const wallet = Wallet.fromMnemonic(mnemonic, path)
    return wallet
  }

  static getSigner(provider: any, wallet: any) {
    const signer = wallet.connect(provider)
    return signer
  }

  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static getCurrentTimestamp() {
    return Math.floor(Date.now()/1000)
  }

  static async getRequest(url: string) {
    const config = {
        method: 'get',
        url: url
    }
    const res = await axios(config)
    return res.data
  }

  static randNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
