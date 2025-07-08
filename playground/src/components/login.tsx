import { useWorker } from '../contexts/worker-context';

export function Login() {
  const { login } = useWorker();

  return (
    <button
      onClick={login}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
    >
      Login with NEAR
    </button>
  );
}
