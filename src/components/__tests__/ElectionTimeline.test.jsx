import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect, vi } from "vitest";
import ElectionTimeline from "../ElectionTimeline";

describe("ElectionTimeline Component", () => {
  const mockPhases = [
    { id: "registration", label: "Registration" },
    { id: "campaigning", label: "Campaigning" },
    { id: "voting", label: "Voting" },
  ];

  it("renders all phases", () => {
    render(
      <ElectionTimeline
        phases={mockPhases}
        currentPhaseId="campaigning"
        onPhaseClick={() => {}}
      />,
    );
    expect(screen.getByText("Registration")).toBeInTheDocument();
    expect(screen.getByText("Campaigning")).toBeInTheDocument();
    expect(screen.getByText("Voting")).toBeInTheDocument();
  });

  it("calls onPhaseClick when a phase is clicked", () => {
    const handlePhaseClick = vi.fn();
    render(
      <ElectionTimeline
        phases={mockPhases}
        currentPhaseId="campaigning"
        onPhaseClick={handlePhaseClick}
      />,
    );

    const votingText = screen.getByText("Voting");
    // Fire click on the container
    fireEvent.click(votingText.parentElement);

    expect(handlePhaseClick).toHaveBeenCalledWith("voting");
  });

  it("highlights current phase appropriately", () => {
    const { container } = render(
      <ElectionTimeline
        phases={mockPhases}
        currentPhaseId="campaigning"
        onPhaseClick={() => {}}
      />,
    );
    // Check if the current phase text has the active color
    const activeText = screen.getByText("Campaigning");
    expect(activeText).toHaveClass("text-accent-purple");
  });
});
