interface WorkerInfoProps {
  accountId: string | undefined;
  balance: string;
}

export default function WorkerInfo({ accountId, balance }: WorkerInfoProps) {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Worker Account</h2>
      <p>Account ID: {accountId}</p>
      <p>Balance: {balance}</p>
    </div>
  );
}
