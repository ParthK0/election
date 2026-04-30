import ReactDOM from "react-dom/client";
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
