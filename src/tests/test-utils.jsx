import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ElectionProvider } from "../context/ElectionContext";
import { ChatProvider } from "../context/ChatContext";
import { AuthProvider } from "../context/AuthContext";

const AllTheProviders = ({ children }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ElectionProvider>
            <ChatProvider>{children}</ChatProvider>
          </ElectionProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};


const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
