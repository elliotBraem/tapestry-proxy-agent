import { useWorker } from "../contexts/worker-context";

export function WorkerInfo() {
  const { accountId, balance } = useWorker();

  return (
<div className="flex flex-col items-start text-sm text-gray-600">
  <p>
    <span className="font-medium">Account:</span> {accountId || "..."}
  </p>
  <p>
    <span className="font-medium">Balance:</span>{" "}
    {balance ? `${balance} NEAR` : "..."}
  </p>
</div>
  );
}
