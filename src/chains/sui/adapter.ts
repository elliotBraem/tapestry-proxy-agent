import { contracts, chainAdapters } from "chainsig.js";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import type { ChainAdapter } from "../types";

const MPC_CONTRACT = new contracts.ChainSignatureContract({
  networkId: `testnet`,
  contractId: `v1.signer-prod.testnet`,
});

const rpcUrl = getFullnodeUrl('testnet');
const suiClient = new SuiClient({ url: rpcUrl });

const Sui = (new chainAdapters.sui.SUI({
    contract: MPC_CONTRACT,
    client: suiClient,
    rpcUrl,
}));

class SuiAdapter implements ChainAdapter {
  async deriveAddress(path: string): Promise<{ address: string; }> {
    const contractId = process.env.NEXT_PUBLIC_contractId;
    if (!contractId) {
      throw new Error("NEXT_PUBLIC_contractId not set");
    }
    const { address } = await Sui.deriveAddressAndPublicKey(
      contractId,
      path,
    );
    return { address };
  }

  async prepareTransaction(from: string, to: string, data: any): Promise<{ transaction: any; hashesToSign: any[]; }> {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [data.amount]);
    tx.transferObjects([coin], to);
    tx.setSender(from);
    const { transaction, hashesToSign } = await Sui.prepareTransactionForSigning(
      tx
    );
    return { transaction, hashesToSign };
  }

  async broadcastTransaction(signedTransaction: any): Promise<{ txHash:string; }> {
    const txHash = await Sui.broadcastTx(signedTransaction);
    return { txHash: txHash.hash };
  }
}

export const suiAdapter = new SuiAdapter();
