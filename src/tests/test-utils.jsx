import { render } from "@testing-library/react";

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
