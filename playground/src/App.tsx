import { Login } from './components/login';
import { Message } from "./components/message";
import { WorkerInfo } from './components/worker-info';
import { useWorker } from './contexts/worker-context';

function App() {
  const { authToken, error } = useWorker();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Shade Agent Playground
        </h1>

        {!authToken ? (
          <div className="flex flex-col items-center">
            <p className="text-gray-600 mb-4">Please log in to continue.</p>
            <Login />
          </div>
        ) : (
          <div>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Authentication Token
              </h2>
              <p className="text-sm text-gray-600 break-all bg-gray-100 p-2 rounded">
                {authToken}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <WorkerInfo />
              </div>
            </div>
          </div>
        )}

        <Message />

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
