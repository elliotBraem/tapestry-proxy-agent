interface BinanceTicker {
    price: string;
}

interface CoinbasePrice {
    data: {
        amount: string;
    };
}

async function getETHPriceFromBinance(): Promise<number | null> {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
        if (!response.ok) {
            throw new Error(`Binance API error: ${response.status}`);
        }
        const data: BinanceTicker = await response.json();
        const price = parseFloat(data.price);
        console.log(`Binance ETH Price: $${price}`);
        return price;
    } catch (error) {
        console.error('Error fetching price from Binance:', error);
        return null;
    }
}

async function getETHPriceFromCoinbase(): Promise<number | null> {
    try {
        const response = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot');
        if (!response.ok) {
            throw new Error(`Coinbase API error: ${response.status}`);
        }
        const data: CoinbasePrice = await response.json();
        const price = parseFloat(data.data.amount);
        console.log(`Coinbase ETH Price: $${price}`);
        return price;
    } catch (error) {
        console.error('Error fetching price from Coinbase:', error);
        return null;
    }
}

export async function getEthereumPriceUSD(): Promise<number | null> {
    try {
        // Fetch from both sources
        const [binancePrice, coinbasePrice] = await Promise.all([
            getETHPriceFromBinance(),
            getETHPriceFromCoinbase()
        ]);

        const validPrices = [binancePrice, coinbasePrice].filter((p): p is number => p !== null);

        if (validPrices.length === 0) {
            console.error('Failed to fetch price from all sources');
            return null;
        }

        // Calculate average: sum up, multiply by 100 and round to integer
        const averagePrice = validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;
        const finalPrice = Math.round(averagePrice * 100);
        
        console.log(`Average ETH Price: $${(finalPrice/100).toFixed(2)} (Binance: $${binancePrice ?? 'N/A'}, Coinbase: $${coinbasePrice ?? 'N/A'})`);
        return finalPrice;
    } catch (error) {
        console.error('Error fetching Ethereum price:', error);
        return null;
    }
}
