import { render, screen, fireEvent, waitFor } from "../../tests/test-utils";
import { describe, it, expect, vi } from "vitest";
import Ask from "../Ask";
import * as useElectionModule from "../../hooks/useElection";
import * as useChatModule from "../../hooks/useChat";
import * as GeminiModule from "../../api/gemini";

vi.mock("../../api/gemini", () => ({
  askGemini: vi.fn(),
}));

describe("Ask Page", () => {
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

  it("handles quick prompt selection", async () => {
    const setChatHistory = vi.fn();
    vi.spyOn(useChatModule, "useChat").mockReturnValue({
      setChatHistory,
      chatHistory: [],
    });
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      currentPhase: "registration",
      role: "voter",
      checklist: {},
      electionData: {
        quickQuestions: ["How do I register to vote?", "What is NOTA?"],
      },
    });

    GeminiModule.askGemini.mockResolvedValue("Mock AI Response");

    render(<Ask />);

    const promptButton = screen.getByText("How do I register to vote?");
    fireEvent.click(promptButton);

    expect(setChatHistory).toHaveBeenCalled();
    await waitFor(() => {
      expect(GeminiModule.askGemini).toHaveBeenCalled();
    });
  });
});
