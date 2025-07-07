export interface ChainAdapter {
  deriveAddress(path: string): Promise<{ address: string }>;
  prepareTransaction(from: string, to: string, data: any): Promise<{ transaction: any; hashesToSign: any[] }>;
  broadcastTransaction(signedTransaction: any): Promise<{ txHash: string }>;
}
