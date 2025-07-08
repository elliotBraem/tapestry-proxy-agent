import { TapestryProxy } from "@/components/tapestry-proxy";
import { useWorker } from "@/contexts/worker-context";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { error } = useWorker();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {/* <EthPrice /> */}
        <TapestryProxy />
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
