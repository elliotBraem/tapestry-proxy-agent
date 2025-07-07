import { ethAdapter } from './eth/adapter';
import { suiAdapter } from './sui/adapter';
import type { ChainAdapter } from './types';

const adapters = {
  eth: ethAdapter,
  sui: suiAdapter,
};

export function getChainAdapter(chainName: 'eth' | 'sui'): ChainAdapter {
  const adapter = adapters[chainName];
  if (!adapter) {
    throw new Error(`No adapter found for chain: ${chainName}`);
  }
  return adapter;
}
