import { ethAdapter } from './eth/adapter';
import { suiAdapter } from './sui/adapter';
import { solanaAdapter } from './sol/adapter';
import type { ChainAdapter } from './types';

const adapters = {
  eth: ethAdapter,
  sui: suiAdapter,
  sol: solanaAdapter,
};

export function getChainAdapter(chainName: 'eth' | 'sui' | 'sol'): ChainAdapter {
  const adapter = adapters[chainName];
  if (!adapter) {
    throw new Error(`No adapter found for chain: ${chainName}`);
  }
  return adapter;
}
