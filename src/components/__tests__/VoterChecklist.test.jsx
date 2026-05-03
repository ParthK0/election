import { render, screen, fireEvent, act } from "../../tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import VoterChecklist from "../VoterChecklist";
import * as useElectionModule from "../../hooks/useElection";
import confetti from "canvas-confetti";

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

describe("VoterChecklist Component", () => {
  const mockToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("renders checklist items for India", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      checklist: {},
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    expect(screen.getByText("Check name in voter list")).toBeInTheDocument();
    expect(screen.getByText("0/6")).toBeInTheDocument();
  });

  it("renders checklist items for USA", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "usa",
      checklist: {},
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    expect(screen.getByText("Register to vote (vote.gov)")).toBeInTheDocument();
    expect(screen.getByText("0/6")).toBeInTheDocument();
  });

  it("calls toggleChecklistItem when item is clicked", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      checklist: {},
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    fireEvent.click(screen.getByText("Check name in voter list"));
    expect(mockToggle).toHaveBeenCalled();
  });

  it("shows correct progress when items are completed", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      checklist: { "in-1": true, "in-2": true, "in-3": true },
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    expect(screen.getByText("3/6")).toBeInTheDocument();
  });

  it("triggers confetti when 100% completed", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      checklist: {
        "in-1": true, "in-2": true, "in-3": true,
        "in-4": true, "in-5": true, "in-6": true
      },
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    expect(confetti).toHaveBeenCalled();
    expect(screen.getByText(/Fully Prepared/i)).toBeInTheDocument();
  });

  it("copies to clipboard with correct formatting on share", async () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      checklist: { "in-1": true },
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    const shareBtn = screen.getByText("Share Progress");
    fireEvent.click(shareBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const callArg = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(callArg).toContain("🗳️ ElectIQ Checklist for INDIA");
    expect(callArg).toContain("Progress: 1/6");
    expect(callArg).toContain("[x] Check name in voter list");
    expect(callArg).toContain("[ ] Get Voter ID (EPIC) card");

    // Test copied state transition
    expect(screen.getByText("Copied to Clipboard")).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(screen.queryByText("Copied to Clipboard")).not.toBeInTheDocument();
    expect(screen.getByText("Share Progress")).toBeInTheDocument();
  });

  it("handles country with no checklist data gracefully", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "unknown",
      checklist: {},
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    expect(screen.getByText("0/0")).toBeInTheDocument();
  });
});
