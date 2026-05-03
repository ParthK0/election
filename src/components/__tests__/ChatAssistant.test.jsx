import { render, screen, fireEvent, waitFor } from "../../tests/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ChatAssistant from "../ChatAssistant";
import { useChat } from "../../hooks/useChat";
import { useElection } from "../../hooks/useElection";
import { askGemini } from "../../api/gemini";

// Mock hooks
vi.mock("../../hooks/useChat");
vi.mock("../../hooks/useElection");

// Mock Gemini API
vi.mock("../../api/gemini", () => ({
  askGemini: vi.fn(),
}));

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

// Mock react-markdown to render simple HTML for testing
vi.mock("react-markdown", () => ({
  default: ({ children, components }) => {
    if (typeof children !== "string") return <div>{children}</div>;
    
    let content = children;
    const parts = [];
    
    // Simple line-by-line processing for the mock
    const lines = content.split('\n');
    return (
      <div>
        {lines.map((line, idx) => {
          if (line.startsWith("- ")) {
            const text = line.replace("- ", "");
            return components?.li ? <components.li key={idx}>{text}</components.li> : <li key={idx}>{text}</li>;
          }
          if (line.includes("**")) {
            const subParts = line.split("**");
            return (
              <p key={idx}>
                {subParts.map((part, i) => 
                  i % 2 === 1 ? (components?.strong ? <components.strong key={i}>{part}</components.strong> : <strong key={i}>{part}</strong>) : part
                )}
              </p>
            );
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  },
}));

describe("ChatAssistant Component", () => {
  beforeEach(() => {
    vi.mocked(useChat).mockReturnValue({
      chatHistory: [],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    vi.mocked(useElection).mockReturnValue({
      country: "India",
      electionData: { glossary: [] },
      checklist: {},
      currentPhase: "Registration",
      role: "Voter",
    });

    vi.mocked(askGemini).mockResolvedValue("Mock AI Response");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    if (vi.isFakeTimers()) {
      vi.useRealTimers();
    }
  });

  it("renders initial state correctly", () => {
    render(<ChatAssistant />);
    expect(screen.getByText("ElectIQ AI")).toBeInTheDocument();
    expect(screen.getByText("How can I guide you?")).toBeInTheDocument();
  });

  it("updates input correctly", () => {
    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hello AI" } });
    expect(input.value).toBe("Hello AI");
  });

  it("submits message and calls askGemini", async () => {
    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Tell me about voting" } });
    fireEvent.submit(input.closest("form"));

    await waitFor(() => {
      expect(askGemini).toHaveBeenCalled();
    });
  });

  it("ELI5 button triggers simplified query", async () => {
    render(<ChatAssistant />);
    const eli5Btn = screen.getByLabelText(/Explain current phase like I'm 10 years old/i);
    fireEvent.click(eli5Btn);
    
    await waitFor(() => {
      expect(askGemini).toHaveBeenCalledWith(
        expect.stringContaining("10 years old"), 
        expect.anything(),
        expect.anything()
      );
    });
  });

  it("renders source links for India", () => {
    vi.mocked(useChat).mockReturnValue({
      chatHistory: [{ role: "bot", content: "You should register to vote." }],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);
    expect(screen.getByText("Voter Service Portal")).toBeInTheDocument();
  });

  it("displays error toast when state has error", () => {
    vi.mocked(useChat).mockReturnValue({
      chatHistory: [],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: "Test Error Message",
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);
    expect(screen.getByText("Test Error Message")).toBeInTheDocument();
  });

  it("handles speech synthesis", () => {
    const speakSpy = vi.fn();
    window.speechSynthesis = {
      speak: speakSpy,
      cancel: vi.fn(),
      getVoices: () => [],
    };

    vi.mocked(useChat).mockReturnValue({
      chatHistory: [{ role: "bot", content: "Hello world" }],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);
    const speechBtn = screen.getByLabelText(/Read message aloud/i);
    fireEvent.click(speechBtn);
    expect(speakSpy).toHaveBeenCalled();
  });

  it("clears history when trash icon is clicked", () => {
    const clearHistory = vi.fn();
    vi.mocked(useChat).mockReturnValue({
      chatHistory: [{ role: "user", content: "hi" }],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory,
    });

    render(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText(/Clear chat history/i));
    expect(clearHistory).toHaveBeenCalled();
  });

  it("handles suggested question click", async () => {
    render(<ChatAssistant />);
    const suggestedQ = screen.getByText("What are the rules for campaigning?");
    fireEvent.click(suggestedQ);

    await waitFor(() => {
      expect(askGemini).toHaveBeenCalledWith(
        "What are the rules for campaigning?",
        expect.anything(),
        expect.anything()
      );
    });
  });

  it("handles typing effect and final history update", async () => {
    vi.useFakeTimers();
    const setChatHistory = vi.fn();
    const setIsLoading = vi.fn();

    vi.mocked(useChat).mockReturnValue({
      chatHistory: [],
      setChatHistory,
      isLoading: false,
      setIsLoading,
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.submit(input.closest("form"));

    // Flush microtasks to allow askGemini to be called
    await vi.runAllTicks();
    await Promise.resolve();

    expect(askGemini).toHaveBeenCalled();

    // Advance timers to finish typing (ChatAssistant types at 10ms interval, 3 chars at a time)
    await vi.advanceTimersByTimeAsync(2000);

    expect(setChatHistory).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("renders complex markdown from bot response", async () => {
    const mockResponse = "**Bold text** and a list:\n- Item 1\n- Item 2";
    vi.mocked(askGemini).mockResolvedValue(mockResponse);

    vi.mocked(useChat).mockReturnValue({
      chatHistory: [{ role: "bot", content: mockResponse }],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);

    const boldText = screen.getByText("Bold text");
    expect(boldText.tagName).toBe("STRONG");
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("renders alternative source links for non-India context", () => {
    vi.mocked(useElection).mockReturnValue({
      country: "USA",
      language: "en",
      currentPhase: "Registration",
      electionData: { glossary: [] },
    });

    vi.mocked(useChat).mockReturnValue({
      chatHistory: [{ role: "bot", content: "You should register to vote for the electoral college." }],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);
    
    expect(screen.getByText("Vote.gov")).toBeInTheDocument();
    expect(screen.getByText("National Archives")).toBeInTheDocument();
  });

  it("returns early when isLoading is true", async () => {
    vi.mocked(useChat).mockReturnValue({
      chatHistory: [],
      setChatHistory: vi.fn(),
      isLoading: true,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.submit(input.closest("form"));

    expect(askGemini).not.toHaveBeenCalled();
  });

  it("handles quota and API key errors specifically", async () => {
    vi.mocked(askGemini).mockRejectedValueOnce(new Error("429 Quota Exceeded"));
    const setError = vi.fn();
    vi.mocked(useChat).mockReturnValue({
      chatHistory: [],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError,
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.submit(input.closest("form"));

    await waitFor(() => {
      expect(setError).toHaveBeenCalledWith(expect.stringContaining("API quota exhausted"));
    });

    vi.mocked(askGemini).mockRejectedValueOnce(new Error("403 Invalid API key"));
    fireEvent.change(input, { target: { value: "test 2" } }); // Change input to re-enable button if needed
    fireEvent.submit(input.closest("form"));
    
    await waitFor(() => {
      expect(setError).toHaveBeenCalledWith(expect.stringContaining("Invalid API key"));
    });
  });

  it("renders candidate-specific source links for India", () => {
    vi.mocked(useChat).mockReturnValue({
      chatHistory: [{ role: "bot", content: "Check the candidate affidavits." }],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);
    expect(screen.getByText("ECI Affidavits")).toBeInTheDocument();
  });

  it("toggles speech synthesis off when clicking twice", () => {
    const cancelSpy = vi.fn();
    window.speechSynthesis = {
      speak: vi.fn(),
      cancel: cancelSpy,
      getVoices: () => [],
    };

    vi.mocked(useChat).mockReturnValue({
      chatHistory: [{ role: "bot", content: "Hello" }],
      setChatHistory: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      error: null,
      setError: vi.fn(),
      clearHistory: vi.fn(),
    });

    render(<ChatAssistant />);
    const speechBtn = screen.getByLabelText(/Read message aloud/i);
    
    // First click to start
    fireEvent.click(speechBtn);
    // Second click to stop
    fireEvent.click(speechBtn);
    
    expect(cancelSpy).toHaveBeenCalledTimes(2); // One at start of handleSpeech, one for toggling off
  });
});





