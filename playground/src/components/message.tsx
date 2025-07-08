import { useWorker } from '../contexts/worker-context';

export function Message() {
  const { message } = useWorker();

  if (!message) {
    return null;
  }

  return (
    <div className={`mt-6 p-4 rounded-lg ${message.success ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-yellow-100 border border-yellow-400 text-yellow-700'}`}>
      <p>{message.text}</p>
    </div>
  );
}
