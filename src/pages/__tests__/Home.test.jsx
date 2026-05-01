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
});
