import { zValidator } from '@hono/zod-validator';
import { signWithAgent } from '@neardefi/shade-agent-js';
import { utils } from 'chainsig.js';
import { Hono } from 'hono';
import { z } from 'zod';
import { getChainAdapter } from '../../chains';

const { toRSV } = utils.cryptography;

const app = new Hono();

const schema = z.object({
  to: z.string(),
  data: z.any(),
});

app.post('/:chain/transaction', zValidator('json', schema), async (c) => {
  const { chain } = c.req.param();
  const { to, data } = c.req.valid('json');

  if (chain !== 'eth' && chain !== 'sui') {
    return c.json({ error: 'Invalid chain' }, 400);
  }

  try {
    const adapter = getChainAdapter(chain);
    const { address: from } = await adapter.deriveAddress(`${chain}-1`);

    const { transaction, hashesToSign } = await adapter.prepareTransaction(from, to, data);

    let signRes;
    let verified = false;
    try {
      const path = `${chain}-1`;
      const payload = hashesToSign[0];
      signRes = await signWithAgent(path, payload);
      verified = true;
    } catch (e) {
      console.log('Contract call error:', e);
    }

    if (!verified) {
      return c.json({ verified, error: 'Failed to sign transaction' }, 400);
    }

    const signatures = chain === 'eth' ? [toRSV(signRes)] : [signRes];

    const signedTransaction =
      chain === 'eth'
        ? (adapter as any).finalizeTransactionSigning({
          transaction,
          rsvSignatures: signatures,
        })
        : (adapter as any).finalizeTransactionSigning({
          transaction,
          serializedSignatures: signatures,
        });

    const txHash = await adapter.broadcastTransaction(signedTransaction);

    return c.json({ txHash });
  } catch (error: any) {
    console.error(`Error in ${chain} transaction:`, error);
    return c.json({ error: 'Internal server error', message: error.message }, 500);
  }
});

export default app;
