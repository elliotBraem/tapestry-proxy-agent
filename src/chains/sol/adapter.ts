import { contracts, chainAdapters } from "chainsig.js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import type { ChainAdapter } from "../types";

const MPC_CONTRACT = new contracts.ChainSignatureContract({
  networkId: `testnet`,
  contractId: `v1.signer-prod.testnet`,
});

const rpcUrl = clusterApiUrl('devnet');
const connection = new Connection(rpcUrl);

const Sol = (new chainAdapters.solana.Solana({
    contract: MPC_CONTRACT,
    solanaConnection: connection,
}));

class SolanaAdapter implements ChainAdapter {
  async deriveAddress(path: string): Promise<{ address: string; }> {
    const contractId = process.env.NEXT_PUBLIC_contractId;
    if (!contractId) {
      throw new Error("NEXT_PUBLIC_contractId not set");
    }
    const { address } = await Sol.deriveAddressAndPublicKey(
      contractId,
      path,
    );
    return { address };
  }

  async prepareTransaction(from: string, to: string, data: any): Promise<{ transaction: any; hashesToSign: any[]; }> {
    // Placeholder for transaction preparation
    throw new Error("Method not implemented.");
  }

  async broadcastTransaction(signedTransaction: any): Promise<{ txHash: string; }> {
    // Placeholder for transaction broadcasting
    throw new Error("Method not implemented.");
  }
}

export const solanaAdapter = new SolanaAdapter();
