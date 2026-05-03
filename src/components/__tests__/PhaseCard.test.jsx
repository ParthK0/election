import { render, screen, fireEvent } from "../../tests/test-utils";
import { expect, test, vi } from "vitest";
import PhaseCard from "../PhaseCard";
import { useElection } from "../../hooks/useElection";

vi.mock("../../hooks/useElection", () => ({
  useElection: vi.fn(),
}));


const mockPhase = {
  label: "Test Phase",
  description: "Test Description",
  icon: "🧪",
  steps: ["Step 1", "Step 2"],
  keyLinks: [{ label: "Link", url: "http://test.com" }],
};

test("renders phase card correctly", () => {
  useElection.mockReturnValue({ role: "voter" });
  render(<PhaseCard phase={mockPhase} isActive={false} />);
  expect(screen.getByText("Test Phase")).toBeInTheDocument();
  expect(screen.getByText("Test Description")).toBeInTheDocument();
});

test("shows details when active", () => {
  useElection.mockReturnValue({ role: "voter" });
  render(<PhaseCard phase={mockPhase} isActive={true} />);
  expect(screen.getByText("Step 1")).toBeInTheDocument();
  expect(screen.getByText("Step 2")).toBeInTheDocument();
});

test("handles click events", () => {
  useElection.mockReturnValue({ role: "voter" });
  const handleClick = vi.fn();
  render(
    <PhaseCard phase={mockPhase} isActive={false} onClick={handleClick} />,
  );

  fireEvent.click(screen.getByText("Test Phase"));
  expect(handleClick).toHaveBeenCalled();
});
test("shows candidate protocol when role is candidate", () => {
  useElection.mockReturnValue({ role: "candidate" });
  const candidatePhase = {
    ...mockPhase,
    candidateDetails: { filings: "Must file form 1" }
  };
  render(<PhaseCard phase={candidatePhase} isActive={true} />);
  expect(screen.getByText(/Candidate Protocol/i)).toBeInTheDocument();
  expect(screen.getByText(/Must file form 1/i)).toBeInTheDocument();
});

test("handles mouse move and leave for tilt effect", () => {
  useElection.mockReturnValue({ role: "voter" });
  render(<PhaseCard phase={mockPhase} isActive={false} />);
  const card = screen.getByText("Test Phase").closest("div");
  
  fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
  fireEvent.mouseLeave(card);
  
  // This just ensures no crash and logic execution
  expect(card).toBeInTheDocument();
});

test("handles link click stopPropagation", () => {
  useElection.mockReturnValue({ role: "voter" });
  const handleClick = vi.fn();
  render(<PhaseCard phase={mockPhase} isActive={true} onClick={handleClick} />);
  
  const link = screen.getByText("Link");
  fireEvent.click(link);
  
  // handleClick shouldn't be called because of stopPropagation on the link
  expect(handleClick).not.toHaveBeenCalled();
});
