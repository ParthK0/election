import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ElectionProvider } from './context/ElectionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ElectionProvider>
      <App />
    </ElectionProvider>
  </React.StrictMode>,
)
