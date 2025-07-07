import { sign } from 'near-sign-verify';
import * as wallet from "fastintear";

interface LoginProps {
  setAuthToken: (token: string) => void;
}

export default function Login({ setAuthToken }: LoginProps) {
  const handleLogin = async () => {
    const contractId = import.meta.env.VITE_SHADE_AGENT_CONTRACT_ID;
    if (!contractId) {
      console.error("Contract ID is not defined in the environment variables.");
      return;
    }
    const token = await sign("login attempt", {
      signer: wallet,
      recipient: contractId,
    });
    setAuthToken(token);
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Login with NEAR
    </button>
  );
}
