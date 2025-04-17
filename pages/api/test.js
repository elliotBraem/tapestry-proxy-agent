import { SearchMode, twitter, bakeCookies } from '../../utils/twitter';
const replied = [];

export default async function test(req, res) {
    const tweets = await twitter.searchTweets('elonmusk', 1, SearchMode.Latest);

    try {
        const tweet = await tweets.next();
        res.status(200).json({ tweet });
    } catch (e) {
        console.log(JSON.stringify(e).substring(0, 256));
    }

    return;

    for (const t of tweets) {
        if (replied.includes(t.id)) continue;

        replied.push(t.id);

        const { address } = await generateAddress({
            publicKey: process.env.MPC_PUBLIC_KEY_TESTNET,
            accountId: process.env.NEXT_PUBLIC_contractId,
            path: t.username,
            chain: 'evm',
        });

        await twitter.sendTweet(
            `😎 Sup @${t.username}! I gotchu an evm account right hurr: ${address}`,
            t.id,
        );
    }

    res.status(200).json({ replied, tweets });
}
