import { render, screen, fireEvent, waitFor } from "../../tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Ask from "../Ask";
import * as useElectionModule from "../../hooks/useElection";
import * as useChatModule from "../../hooks/useChat";
import * as GeminiModule from "../../api/gemini";

vi.mock("../../api/gemini", () => ({
  askGemini: vi.fn(),
}));

describe("Ask Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renders header and context info", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      currentPhase: "registration",
      role: "voter",
      checklist: {},
      electionData: { quickQuestions: [] }
    });

    render(<Ask />);
    expect(screen.getByText("Election Assistant")).toBeInTheDocument();
  });

  it("handles quick prompt selection with checklist items", async () => {
    const setChatHistory = vi.fn();
    vi.spyOn(useChatModule, "useChat").mockReturnValue({
      setChatHistory,
      chatHistory: [],
    });
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      currentPhase: "registration",
      role: "voter",
      checklist: { "in-1": true }, // Mock correct ID for India
      electionData: {
        quickQuestions: ["How do I register to vote?"],
      },
    });

    GeminiModule.askGemini.mockResolvedValue("Mock AI Response");

    render(<Ask />);

    const promptButton = screen.getByText("How do I register to vote?");
    fireEvent.click(promptButton);

    await waitFor(() => {
      expect(GeminiModule.askGemini).toHaveBeenCalled();
    });
    // Check if setChatHistory was called with the bot response
    expect(setChatHistory).toHaveBeenCalledWith(expect.any(Function));
  });

  it("handles errors in handleQuickPrompt", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(useChatModule, "useChat").mockReturnValue({
      setChatHistory: vi.fn(),
      chatHistory: [],
    });
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      currentPhase: "registration",
      role: "voter",
      checklist: {},
      electionData: {
        quickQuestions: ["How do I register to vote?"],
      },
    });

    GeminiModule.askGemini.mockRejectedValue(new Error("API Error"));

    render(<Ask />);

    const promptButton = screen.getByText("How do I register to vote?");
    fireEvent.click(promptButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it("returns early if already processing", async () => {
    vi.spyOn(useChatModule, "useChat").mockReturnValue({
      setChatHistory: vi.fn(),
      chatHistory: [],
    });
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      currentPhase: "registration",
      role: "voter",
      checklist: {},
      electionData: { quickQuestions: ["Q1"] }
    });

    // Manually trigger a state where it might be processing if we could
    // But we can test it by firing two clicks and seeing if askGemini is called once
    GeminiModule.askGemini.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve("done"), 100)));

    render(<Ask />);
    const promptButton = screen.getByText("Q1");
    fireEvent.click(promptButton);
    fireEvent.click(promptButton); // Second click while processing

    await waitFor(() => {
      expect(GeminiModule.askGemini).toHaveBeenCalledTimes(1);
    });
  });

  it("handles country not in checklistData", async () => {
    vi.spyOn(useChatModule, "useChat").mockReturnValue({
      setChatHistory: vi.fn(),
      chatHistory: [],
    });
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "nonexistent",
      currentPhase: "registration",
      role: "voter",
      checklist: {},
      electionData: { quickQuestions: ["Q1"] }
    });

    GeminiModule.askGemini.mockResolvedValue("Response");

    render(<Ask />);
    fireEvent.click(screen.getByText("Q1"));

    await waitFor(() => {
      expect(GeminiModule.askGemini).toHaveBeenCalled();
    });
  });
});
