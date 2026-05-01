import { render, screen, fireEvent, waitFor } from "../../tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatAssistant from "../ChatAssistant";
import * as useChatModule from "../../hooks/useChat";
import * as useElectionModule from "../../hooks/useElection";
import * as GeminiModule from "../../api/gemini";

vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(() => ({ options: {} })),
}));

vi.mock("../lib/firebase", () => ({
  db: {},
  analytics: { options: {} },
  functions: {},
  perf: { trace: () => ({ start: vi.fn(), stop: vi.fn() }) },
}));

vi.mock("react-markdown", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

describe("ChatAssistant Component", () => {
  beforeEach(() => {
    vi.spyOn(useChatModule, "useChat").mockReturnValue({
      chatHistory: [],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      electionData: { glossary: [] },
      checklist: {},
      currentPhase: "registration",
      role: "voter",
    });
  });

  it("renders initial state correctly", () => {
    render(<ChatAssistant />);
    expect(screen.getByText("ElectIQ AI")).toBeInTheDocument();
    expect(screen.getByText("How can I guide you?")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type your message..."),
    ).toBeInTheDocument();
  });

  it("updates input correctly", () => {
    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hello AI" } });
    expect(input.value).toBe("Hello AI");
  });

  it("sanitizes XSS from bot messages using DOMPurify", () => {
    const maliciousContent =
      "Hello <script>alert('xss')</script>World <img src=x onerror=alert(1)>";

    vi.spyOn(useChatModule, "useChat").mockReturnValue({
      chatHistory: [{ role: "bot", content: maliciousContent }],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);

    const textContent = screen.getByText(/Hello/).textContent;

    expect(textContent).not.toContain("<script>");
    expect(textContent).not.toContain("alert('xss')");
    expect(textContent).not.toContain("onerror");
    expect(textContent).toContain("Hello");
    expect(textContent).toContain("World");
  });

  it("calls askGemini on submit", async () => {
    const setChatHistory = vi.fn();
    vi.spyOn(useChatModule, "useChat").mockReturnValue({
      chatHistory: [],
      setChatHistory,
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    const askGeminiSpy = vi.spyOn(GeminiModule, "askGemini").mockResolvedValue("Mock AI Response");

    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hello AI" } });

    const sendButton = screen.getByLabelText("Send message");
    fireEvent.click(sendButton);

    expect(setChatHistory).toHaveBeenCalled();
    await waitFor(() => {
      expect(askGeminiSpy).toHaveBeenCalledWith("Hello AI", expect.any(Object), []);
    });
  });
});
