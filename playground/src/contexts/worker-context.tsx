import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { sign } from 'near-sign-verify';
import * as wallet from "fastintear";

interface MessageData {
  text: string;
  success: boolean;
}

interface WorkerContextType {
  authToken: string;
  message: MessageData | null;
  accountId: string | undefined;
  balance: string;
  error: string;
  login: () => Promise<void>;
  sendTransaction: (chain: string, to: string, data: any) => Promise<void>;
  getWorkerDetails: () => Promise<void>;
}

const WorkerContext = createContext<WorkerContextType | undefined>(undefined);

export const useWorker = (): WorkerContextType => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorker must be used within a WorkerProvider');
  }
  return context;
};

interface WorkerProviderProps {
  children: ReactNode;
}

export const WorkerProvider = ({ children }: WorkerProviderProps) => {
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
    try {
      const res = await fetch('/api/v1/worker').then((r) => r.json());
      if (res.error) {
        console.log('Error getting worker account:', res.error);
        setError('Failed to get worker account details');
        return;
      }
      setAccountId(res.accountId);
      setBalance(res.balance);
    } catch (e) {
      console.error(e);
      setError('Failed to get worker account details');
    }
  };

  const login = async () => {
    const contractId = import.meta.env.VITE_SHADE_AGENT_CONTRACT_ID;
    if (!contractId) {
      console.error("Contract ID is not defined in the environment variables.");
      setError("Contract ID is not configured.");
      return;
    }
    try {
      const token = await sign("login attempt", {
        signer: wallet,
        recipient: contractId,
      });
      setAuthToken(token);
    } catch (e) {
      console.error(e);
      setError("Failed to sign in.");
    }
  };

  const sendTransaction = async (chain: string, to: string, data: any) => {
    setMessage({
      text: 'Sending transaction...',
      success: false,
    });

    try {
      const res = await fetch(`/api/v1/${chain}/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ to, data }),
      }).then((r) => r.json());

      if (res.txHash) {
        setMessageHide('Transaction successful!', 3000, true);
      } else {
        setMessageHide(res.message || 'Transaction failed.', 3000, false);
      }
    } catch (e) {
      console.error(e);
      setMessageHide('Transaction failed.', 3000, false);
    }
  };

  useEffect(() => {
    getWorkerDetails();
  }, []);

  const value = {
    authToken,
    message,
    accountId,
    balance,
    error,
    login,
    sendTransaction,
    getWorkerDetails,
  };

  return (
    <WorkerContext.Provider value={value}>
      {children}
    </WorkerContext.Provider>
  );
};
