import { contracts, chainAdapters } from "chainsig.js";
import { createPublicClient, http } from "viem";
import { Contract, JsonRpcProvider } from "ethers";
import type { ChainAdapter } from "../types";

export const ethRpcUrl = 'https://sepolia.drpc.org';
export const ethContractAddress = '0xb8d9b079F1604e9016137511464A1Fe97F8e2Bd8';

export const ethContractAbi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "updatePrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const MPC_CONTRACT = new contracts.ChainSignatureContract({
  networkId: `testnet`,
  contractId: `v1.signer-prod.testnet`,
});

const publicClient = createPublicClient({
    transport: http(ethRpcUrl),
  });

const Evm = (new chainAdapters.evm.EVM({
    publicClient,
    contract: MPC_CONTRACT
}));

const provider = new JsonRpcProvider(ethRpcUrl);
const contract = new Contract(ethContractAddress, ethContractAbi, provider);

class EthAdapter implements ChainAdapter {
  async deriveAddress(path: string): Promise<{ address: string; }> {
    const contractId = process.env.NEXT_PUBLIC_contractId;
    if (!contractId) {
      throw new Error("NEXT_PUBLIC_contractId not set");
    }
    const { address } = await Evm.deriveAddressAndPublicKey(
      contractId,
      path,
    );
    return { address };
  }

  async prepareTransaction(from: string, to: string, data: any): Promise<{ transaction: any; hashesToSign: any[]; }> {
    const { transaction, hashesToSign } = await Evm.prepareTransactionForSigning({
      from: from as `0x${string}`,
      to: to as `0x${string}`,
      data,
    });
    return { transaction, hashesToSign };
  }

  async broadcastTransaction(signedTransaction: any): Promise<{ txHash: string; }> {
    const txHash = await Evm.broadcastTx(signedTransaction);
    return { txHash: txHash.hash };
  }

  async getContractPrice() {
    return await contract.getPrice();
  }
}

export const ethAdapter = new EthAdapter();
