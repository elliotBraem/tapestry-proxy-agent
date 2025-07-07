interface EthPriceProps {
  sendTransaction: () => void;
  authToken: string;
}

export default function EthPrice({ sendTransaction, authToken }: EthPriceProps) {
  return (
    <div className="mt-4">
      <button
        onClick={sendTransaction}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        disabled={!authToken}
      >
        Set ETH Price
      </button>
    </div>
  );
}
