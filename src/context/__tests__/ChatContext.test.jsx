import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChatProvider } from "../ChatContext";
import { useChat } from "../../hooks/useChat";

const TestChatComponent = () => {
  const { chatHistory, setChatHistory, clearHistory, error, setError } = useChat();
  return (
    <div>
      <div data-testid="history-len">{chatHistory.length}</div>
      <div data-testid="error">{error}</div>
      <button onClick={() => setChatHistory([{ role: "user", content: "hi" }])}>Add Msg</button>
      <button onClick={() => clearHistory()}>Clear</button>
      <button onClick={() => setError("test error")}>Set Error</button>
    </div>
  );
};

describe("ChatContext", () => {
  it("manages chat history and errors", () => {
    render(
      <ChatProvider>
        <TestChatComponent />
      </ChatProvider>
    );

    expect(screen.getByTestId("history-len").textContent).toBe("0");
    
    fireEvent.click(screen.getByText("Add Msg"));
    expect(screen.getByTestId("history-len").textContent).toBe("1");

    fireEvent.click(screen.getByText("Set Error"));
    expect(screen.getByTestId("error").textContent).toBe("test error");

    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByTestId("history-len").textContent).toBe("0");
  });
});
