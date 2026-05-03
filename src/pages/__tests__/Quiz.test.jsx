import { render, screen, fireEvent, waitFor } from "../../tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Quiz from "../Quiz";
import { useElection } from "../../hooks/useElection";

// Mock Firebase
vi.mock("../../lib/firebase", () => ({
  db: {
    collection: vi.fn(),
  },
  functions: {},
  analytics: {},
  auth: {
    onAuthStateChanged: vi.fn(() => vi.fn()),
    currentUser: null,
  },
}));

// Mock Firebase SDKs
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: "mock-doc-id" }),
}));

vi.mock("firebase/functions", () => ({
  httpsCallable: vi.fn(() => vi.fn().mockResolvedValue({ data: [{ country: "india", difficulty: "Beginner", score: 2, total: 2 }] })),
}));

vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null);
    return vi.fn();
  }),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

// Mock useElection hook
vi.mock("../../hooks/useElection", () => ({
  useElection: vi.fn(),
}));

const mockQuizData = [
  { id: "q1", question: "What is 1+1?", options: ["1", "2", "3", "4"], answer: 1, explanation: "Math.", difficulty: "Beginner" },
  { id: "q2", question: "What is 2+2?", options: ["3", "4", "5", "6"], answer: 1, explanation: "More math.", difficulty: "Beginner" },
];

describe("Quiz Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useElection).mockReturnValue({
      country: "india",
      electionData: {
        quiz: mockQuizData,
        phases: []
      },
      role: "voter",
      checklist: {},
      toggleChecklistItem: vi.fn()
    });
    
    // Mock navigator.share
    if (typeof navigator !== 'undefined') {
        navigator.share = vi.fn().mockResolvedValue(true);
    }
  });

  it("renders empty state when quiz data is missing", () => {
    vi.mocked(useElection).mockReturnValue({
      country: "india",
      electionData: null,
      role: "voter",
      checklist: {},
      toggleChecklistItem: vi.fn()
    });
    render(<Quiz />);
    expect(screen.getByText(/Intelligence Not Available/i)).toBeInTheDocument();
  });

  it("renders difficulty selector initially", () => {
    render(<Quiz />);
    expect(screen.getByText(/Election Intelligence Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/Beginner/i)).toBeInTheDocument();
  });

  it("starts quiz when difficulty is selected", async () => {
    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    expect(await screen.findByText(/Question 1/i)).toBeInTheDocument();
    expect(screen.getByText(/What is 1\+1\?/i)).toBeInTheDocument();
  });

  it("handles incorrect answer selection", async () => {
    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    
    // Correct answer is "2" (index 1), so "1" (index 0) is incorrect
    const incorrectOption = await screen.findByText("1");
    fireEvent.click(incorrectOption);
    
    expect(await screen.findByText(/Intelligence Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue/i)).toBeInTheDocument();
  });

  it("completes quiz and shows results with leaderboard", async () => {
    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    
    // Q1: select "2"
    fireEvent.click(await screen.findByText("2"));
    fireEvent.click(await screen.findByText(/Continue/i));
    
    // Q2: select "4"
    fireEvent.click(await screen.findByText("4"));
    fireEvent.click(await screen.findByText(/See Final Score/i));
    
    expect(await screen.findByText(/Analysis Complete/i)).toBeInTheDocument();
    expect(screen.getByText(/You scored/i)).toBeInTheDocument();
    expect(screen.getByTestId("quiz-score").textContent).toBe("2");
    
    // Check leaderboard
    expect(await screen.findByText(/Global Leaderboard/i)).toBeInTheDocument();
    expect(await screen.findByText("INDIA")).toBeInTheDocument();
  });

  it("handles sharing", async () => {
    const shareMock = vi.fn().mockResolvedValue(true);
    navigator.share = shareMock;

    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    fireEvent.click(await screen.findByText("2"));
    fireEvent.click(await screen.findByText(/Continue/i));
    fireEvent.click(await screen.findByText("4"));
    fireEvent.click(await screen.findByText(/See Final Score/i));

    const shareBtn = await screen.findByText(/Share/i);
    fireEvent.click(shareBtn);
    expect(shareMock).toHaveBeenCalled();
  });

  it("handles share errors", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const shareMock = vi.fn().mockRejectedValue(new Error("Share failed"));
    navigator.share = shareMock;

    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    fireEvent.click(await screen.findByText("2"));
    fireEvent.click(await screen.findByText(/Continue/i));
    fireEvent.click(await screen.findByText("4"));
    fireEvent.click(await screen.findByText(/See Final Score/i));

    const shareBtn = await screen.findByText(/Share/i);
    fireEvent.click(shareBtn);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it("resets quiz when Retry is clicked", async () => {
    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    
    fireEvent.click(await screen.findByText("2"));
    fireEvent.click(await screen.findByText(/Continue/i));
    fireEvent.click(await screen.findByText("4"));
    fireEvent.click(await screen.findByText(/See Final Score/i));
    
    fireEvent.click(await screen.findByText(/Retry/i));
    expect(await screen.findByText(/Election Intelligence Quiz/i)).toBeInTheDocument();
  });

  it("handles fetchLeaderboard error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { httpsCallable } = await import("firebase/functions");
    vi.mocked(httpsCallable).mockImplementationOnce(() => vi.fn().mockRejectedValue(new Error("Leaderboard fetch failed")));

    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    fireEvent.click(await screen.findByText("2"));
    fireEvent.click(await screen.findByText(/Continue/i));
    fireEvent.click(await screen.findByText("4"));
    fireEvent.click(await screen.findByText(/See Final Score/i));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching leaderboard", expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it("handles saveScore error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { addDoc } = await import("firebase/firestore");
    vi.mocked(addDoc).mockRejectedValueOnce(new Error("Save score failed"));

    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    fireEvent.click(await screen.findByText("2"));
    fireEvent.click(await screen.findByText(/Continue/i));
    fireEvent.click(await screen.findByText("4"));
    fireEvent.click(await screen.findByText(/See Final Score/i));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to save quiz score to Firestore:", expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it("shows alert when sharing is not supported", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const originalShare = navigator.share;
    delete navigator.share;

    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    fireEvent.click(await screen.findByText("2"));
    fireEvent.click(await screen.findByText(/Continue/i));
    fireEvent.click(await screen.findByText("4"));
    fireEvent.click(await screen.findByText(/See Final Score/i));

    const shareBtn = await screen.findByText(/Share/i);
    fireEvent.click(shareBtn);

    expect(alertSpy).toHaveBeenCalledWith("Sharing is not supported on this device/browser.");
    
    navigator.share = originalShare;
    alertSpy.mockRestore();
  });

  it("renders fun fact if available", async () => {
    const quizWithFact = [
      { id: "q1", question: "Q1", options: ["A", "B"], answer: 0, explanation: "E1", funFact: "Interesting fact!", difficulty: "Beginner" }
    ];
    vi.mocked(useElection).mockReturnValue({
      country: "india",
      electionData: { quiz: quizWithFact, phases: [] },
      role: "voter",
      checklist: {},
      toggleChecklistItem: vi.fn()
    });

    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    fireEvent.click(screen.getByText("A"));

    expect(await screen.findByText("Interesting fact!")).toBeInTheDocument();
  });

  it("handles leaderboard entry with missing country", async () => {
    const { httpsCallable } = await import("firebase/functions");
    vi.mocked(httpsCallable).mockReturnValue(vi.fn().mockResolvedValue({ 
      data: [{ difficulty: "Beginner", score: 1, total: 1 }] // country is missing
    }));

    vi.mocked(useElection).mockReturnValue({
      country: "india",
      electionData: { quiz: mockQuizData, phases: [] },
      role: "voter",
      checklist: {},
      toggleChecklistItem: vi.fn()
    });

    render(<Quiz />);
    fireEvent.click(screen.getByText(/Beginner/i));
    
    // Answer Q1
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText(/Continue/i));
    
    // Answer Q2
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText(/See Final Score/i));

    expect(await screen.findByText("UNKNOWN")).toBeInTheDocument();
  });
});
