import { WorkerInfo } from "@/components/worker-info";
import { Toaster } from "@/components/ui/sonner";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="h-16 flex items-center justify-between px-4 bg-white shadow-md">
        <div className="flex items-center">
          <img
            src="/shade-agent.svg"
            alt="Shade Agent Logo"
            className="h-8 w-8 mr-4"
          />
          <h1 className="text-xl font-bold text-gray-800">
            Shade Agent Playground
          </h1>
        </div>
        <WorkerInfo />
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="p-4">
        <div className="flex justify-end items-center">
          <img src="/symbol.svg" alt="Symbol" className="h-6 w-6 mr-2" />
          <img src="/wordmark_black.svg" alt="Wordmark" className="h-6" />
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
