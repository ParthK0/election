import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as ElectionContextModule from "../../context/ElectionContext";

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

describe("VoterChecklist Component", () => {
  const mockToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("renders checklist items for current country", () => {
    vi.spyOn(ElectionContextModule, "useElection").mockReturnValue({
      country: "india",
      checklist: {},
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    expect(screen.getByText("Check name in voter list")).toBeInTheDocument();
    expect(screen.getByText("0/6")).toBeInTheDocument();
  });

  it("calls toggleChecklistItem when item is clicked", () => {
    vi.spyOn(ElectionContextModule, "useElection").mockReturnValue({
      country: "india",
      checklist: {},
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    fireEvent.click(screen.getByText("Check name in voter list"));
    expect(mockToggle).toHaveBeenCalledWith("in-1");
  });

  it("shows correct progress when items are completed", () => {
    vi.spyOn(ElectionContextModule, "useElection").mockReturnValue({
      country: "india",
      checklist: { "in-1": true, "in-2": true, "in-3": true },
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    expect(screen.getByText("3/6")).toBeInTheDocument();
  });

  it("copies to clipboard on share", () => {
    vi.spyOn(ElectionContextModule, "useElection").mockReturnValue({
      country: "india",
      checklist: { "in-1": true },
      toggleChecklistItem: mockToggle,
    });

    render(<VoterChecklist />);
    fireEvent.click(screen.getByText("Share Progress"));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
