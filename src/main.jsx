import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ElectionProvider } from './context/ElectionContext'
import { ChatProvider } from './context/ChatContext'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ElectionProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </ElectionProvider>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>,
)
