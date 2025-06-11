import { getWorkerAccount } from '@neardefi/shade-agent-js';

export default async function handler(req, res) {
    try {
        const accountId = await getWorkerAccount();
        res.status(200).json({ accountId });
    } catch (error) {
        console.error('Error getting worker account:', error);
        res.status(500).json({ error: 'Failed to get worker account' });
    }
} 