import { useState, useEffect } from 'react';
import Login from './components/Login';
import WorkerInfo from './components/WorkerInfo';
import EthPrice from './components/EthPrice';
import Message from './components/Message';

interface MessageData {
  text: string;
  success: boolean;
}

function App() {
  const [authToken, setAuthToken] = useState('');
  const [message, setMessage] = useState<MessageData | null>(null);
  const [accountId, setAccountId] = useState<string | undefined>();
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');

  const setMessageHide = async (text: string, dur = 3000, success = false) => {
    setMessage({ text, success });
    await new Promise((r) => setTimeout(r, dur));
    setMessage(null);
  };

  const getWorkerDetails = async () => {
    const res = await fetch('/api/v1/worker').then((r) => r.json());
    if (res.error) {
      console.log('Error getting worker account:', res.error);
      setError('Failed to get worker account details');
      return;
    }
    setAccountId(res.accountId);
    setBalance(res.balance);
  };

  const sendTransaction = async () => {
    setMessage({
      text: 'Querying and sending the ETH price to the Ethereum contract...',
      success: false,
    });

    try {
      const res = await fetch('/api/v1/eth/transaction', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: "0x...", 
            data: "0x..."
        })
      }).then((r) => r.json());

      if (res.txHash) {
        setMessageHide('Successfully set the ETH price!', 3000, true);
      } else {
        setMessageHide('Error: Check that both accounts have been funded.', 3000, false);
      }
    } catch (e) {
      console.error(e);
      setMessageHide('Error: Check that both accounts have been funded.', 3000, false);
    }
  };

  useEffect(() => {
    getWorkerDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">NEAR Sign-In</h1>
        <Login setAuthToken={setAuthToken} />
        {authToken && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h2 className="text-lg font-semibold">Auth Token:</h2>
            <p className="break-all">{authToken}</p>
          </div>
        )}
        <WorkerInfo accountId={accountId} balance={balance} />
        <EthPrice sendTransaction={sendTransaction} authToken={authToken} />
        <Message message={message} />
        {error && (
          <div className="mt-4 p-4 bg-red-200 rounded">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
