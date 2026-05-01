import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ElectionProvider } from "../context/ElectionContext";
import { ChatProvider } from "../context/ChatContext";

const AllTheProviders = ({ children }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ElectionProvider>
          <ChatProvider>{children}</ChatProvider>
        </ElectionProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
