import { Hono } from 'hono';
import { Evm } from '../utils/ethereum.js';

const contractId = process.env.NEXT_PUBLIC_contractId;

const app = new Hono();

app.get('/', async (c) => {
    try {
        const { address: senderAddress } = await Evm.deriveAddressAndPublicKey(
            contractId,
            "ethereum-1",
        );
        return c.json({ senderAddress });
    } catch (error) {
        console.log('Error getting worker account:', error);
        return c.json({ error: 'Failed to get worker account' }, 500);
    }
});

export default app; 