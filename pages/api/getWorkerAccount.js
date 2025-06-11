import { getWorkerAccount } from '@neardefi/shade-agent-js';

export default async function handler(req, res) {
    try {
        console.log('Getting worker account');
        const accountId = await getWorkerAccount();
        console.log('Worker account:', accountId);
        res.status(200).json({ accountId });
    } catch (error) {
        console.error('Error getting worker account:', error);
        res.status(500).json({ error: 'Failed to get worker account ' + error });
    }
} 