import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { ElectionProvider } from "./context/ElectionContext";
import { ChatProvider } from "./context/ChatContext";
import "./index.css";
import "./lib/firebase.js";

ReactDOM.createRoot(document.getElementById("root")).render(
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
);
