import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Learn from "../Learn";
import { useElection } from "../../hooks/useElection";

// Mock Firebase
vi.mock("../../lib/firebase", () => ({
  db: {},
  functions: {},
  analytics: {},
  auth: {
    onAuthStateChanged: vi.fn(() => vi.fn()), // Returns unsubscribe function
    currentUser: null,
  },
}));

// Mock Firebase Auth SDK
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null); // Simulate no user logged in
    return vi.fn(); // Unsubscribe
  }),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
}));

// Mock useElection hook
vi.mock("../../hooks/useElection", () => ({
  useElection: vi.fn(),
}));

const mockElectionData = {
  electionName: "General Election 2025",
  phases: [
    { id: "p1", label: "Registration Phase", description: "First phase description", icon: "📋", steps: [], keyLinks: [], date: "2030-01-01" },
    { id: "p2", label: "Voting Phase", description: "Second phase description", icon: "🗳️", steps: [], keyLinks: [], date: "2030-05-01" },
  ],
  keyDates: [
    { event: "Polling Day", date: "Jan 1, 2025" },
  ],
  eligibility: {
    age: "18+",
    citizenship: "Required"
  }
};

describe("Learn Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useElection).mockReturnValue({
      country: "india",
      electionData: mockElectionData,
      currentPhase: "p1",
      setCurrentPhase: vi.fn(),
      subCategory: "loksabha",
      setSubCategory: vi.fn(),
      role: "voter",
      checklist: { "in-1": true },
      toggleChecklistItem: vi.fn(),
    });
  });

  it("renders election name correctly", () => {
    render(<Learn />);
    const electionName = screen.getByRole("heading", { name: mockElectionData.electionName });
    expect(electionName).toBeInTheDocument();
  });

  it("switches sub-category when buttons are clicked", () => {
    const setSubCategory = vi.fn();
    vi.mocked(useElection).mockReturnValue({
      country: "india",
      electionData: mockElectionData,
      currentPhase: "p1",
      setCurrentPhase: vi.fn(),
      subCategory: "loksabha",
      setSubCategory,
      role: "voter",
      checklist: {},
      toggleChecklistItem: vi.fn(),
    });

    render(<Learn />);
    const rajyaSabhaBtn = screen.getByText("Rajya Sabha");
    fireEvent.click(rajyaSabhaBtn);
    expect(setSubCategory).toHaveBeenCalledWith("rajyasabha");

    const lokSabhaBtn = screen.getByText("Lok Sabha");
    fireEvent.click(lokSabhaBtn);
    expect(setSubCategory).toHaveBeenCalledWith("loksabha");
  });

  it("renders all election phases", () => {
    render(<Learn />);
    expect(screen.getAllByText("Registration Phase").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Voting Phase").length).toBeGreaterThan(0);
  });

  it("renders eligibility information", () => {
    render(<Learn />);
    expect(screen.getByText(/Eligibility/i)).toBeInTheDocument();
    expect(screen.getByText("18+")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("renders key dates", () => {
    render(<Learn />);
    expect(screen.getByText("Polling Day")).toBeInTheDocument();
    expect(screen.getByText("Jan 1, 2025")).toBeInTheDocument();
  });

  it("renders voter checklist", () => {
    render(<Learn />);
    expect(screen.getByText(/Your Checklist/i)).toBeInTheDocument();
  });

  it("renders countdown timer", () => {
    render(<Learn />);
    expect(screen.getByText(/Days/i)).toBeInTheDocument();
  });

  it("renders loading state when electionData is null", () => {
    vi.mocked(useElection).mockReturnValue({
      country: "india",
      electionData: null,
      currentPhase: "p1",
      setCurrentPhase: vi.fn(),
      subCategory: "loksabha",
      setSubCategory: vi.fn(),
      role: "voter",
      checklist: {},
      toggleChecklistItem: vi.fn(),
    });
    render(<Learn />);
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });



  it("switches phase when phase card is clicked", () => {
    const setCurrentPhase = vi.fn();
    vi.mocked(useElection).mockReturnValue({
      country: "india",
      electionData: mockElectionData,
      currentPhase: "p1",
      setCurrentPhase,
      subCategory: "loksabha",
      setSubCategory: vi.fn(),
      role: "voter",
      checklist: {},
      toggleChecklistItem: vi.fn(),
    });

    render(<Learn />);
    const votingPhaseCard = screen.getByRole("heading", { name: "Voting Phase" }).closest("div");
    fireEvent.click(votingPhaseCard);
    expect(setCurrentPhase).toHaveBeenCalledWith("p2");
  });

  it("does not render sub-category selector for non-india countries", () => {
    vi.mocked(useElection).mockReturnValue({
      country: "usa",
      electionData: mockElectionData,
      currentPhase: "p1",
      setCurrentPhase: vi.fn(),
      subCategory: "general",
      setSubCategory: vi.fn(),
      role: "voter",
      checklist: {},
      toggleChecklistItem: vi.fn(),
    });

    render(<Learn />);
    expect(screen.queryByText("Lok Sabha")).not.toBeInTheDocument();
    expect(screen.queryByText("Rajya Sabha")).not.toBeInTheDocument();
  });
});
