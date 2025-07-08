import { contracts, chainAdapters } from "chainsig.js";
import { createPublicClient, http } from "viem";
import type { ChainAdapter } from "../types";

export const ethRpcUrl = 'https://sepolia.drpc.org';

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
}

export const ethAdapter = new EthAdapter();
