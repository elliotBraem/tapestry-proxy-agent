import { useWorker } from '../contexts/worker-context';

export function WorkerInfo() {
  const { accountId, balance } = useWorker();

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Worker Account</h2>
      <div className="text-sm text-gray-600">
        <p><span className="font-medium">Account ID:</span> {accountId || 'Loading...'}</p>
        <p><span className="font-medium">Balance:</span> {balance ? `${balance} NEAR` : 'Loading...'}</p>
      </div>
    </div>
  );
}
