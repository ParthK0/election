import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect, vi } from "vitest";
import Home from "../Home";
import * as useElectionModule from "../../hooks/useElection";

describe("Home Page", () => {
  it("renders correctly", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      setRole: vi.fn(),
      role: "voter",
      country: "india",
      electionData: { phases: [], targetDate: "2028-01-01" },
      currentPhase: "registration"
    });

    render(<Home />);
    expect(screen.getByText(/Empowering/i)).toBeInTheDocument();
    expect(screen.getByText(/Democracy with/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Guide/i)).toBeInTheDocument();
    expect(screen.getByText(/Consult AI/i)).toBeInTheDocument();
  });

  it("allows toggling between Voter and Candidate roles", () => {
    const setRoleMock = vi.fn();
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      setRole: setRoleMock,
      role: "voter",
      country: "india",
      electionData: { phases: [{ id: "registration", label: "Registration" }], targetDate: "2028-01-01" },
      currentPhase: "registration"
    });

    render(<Home />);

    // It should render role selectors
    const candidateBtn = screen.getByText("Candidate").closest("button");
    fireEvent.click(candidateBtn);

    expect(setRoleMock).toHaveBeenCalledWith("candidate");
  });

  it("renders candidate-specific content when role is candidate", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      setRole: vi.fn(),
      role: "candidate",
      country: "india",
      electionData: { 
        phases: [{ id: "registration", label: "Registration" }], 
        targetDate: "2028-01-01" 
      },
      currentPhase: "registration"
    });

    render(<Home />);
    
    // Line 184: Campaign Progress
    expect(screen.getByText("Campaign Progress")).toBeInTheDocument();
    
    // Line 256: Assistant text for candidate
    expect(screen.getByText(/Your nomination package requires 10 proposers/i)).toBeInTheDocument();
  });

  it("handles missing or incomplete election data", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      setRole: vi.fn(),
      role: "voter",
      country: "india",
      electionData: null,
      currentPhase: null
    });

    render(<Home />);
    
    // Lines 194, 207, 221: Should show placeholders for missing values
    expect(screen.getByText(/— Phases/i)).toBeInTheDocument();
    const placeholders = screen.getAllByText("—");
    expect(placeholders.length).toBe(2); // Next Election and Progress %
  });

  it("handles empty phases array", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      setRole: vi.fn(),
      role: "voter",
      country: "india",
      electionData: { phases: [], targetDate: "2028-01-01" },
      currentPhase: "none"
    });

    render(<Home />);
    
    // Line 216: Should show "Current Phase" default label
    expect(screen.getByText("Current Phase")).toBeInTheDocument();
  });
});
