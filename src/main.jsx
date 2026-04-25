import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ElectionProvider } from './context/ElectionContext'
import { ChatProvider } from './context/ChatContext'
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ElectionProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </ElectionProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
