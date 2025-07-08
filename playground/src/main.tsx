import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { WorkerProvider } from './contexts/worker-context'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <WorkerProvider>
      <App />
    </WorkerProvider>
  </React.StrictMode>,
)
