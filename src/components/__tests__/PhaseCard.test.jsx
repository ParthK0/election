import { render, screen, fireEvent } from "../tests/test-utils";
import { expect, test, vi } from "vitest";

const mockPhase = {
  label: "Test Phase",
  description: "Test Description",
  icon: "🧪",
  steps: ["Step 1", "Step 2"],
  keyLinks: [{ label: "Link", url: "http://test.com" }],
};

test("renders phase card correctly", () => {
  render(<PhaseCard phase={mockPhase} isActive={false} />);
  expect(screen.getByText("Test Phase")).toBeInTheDocument();
  expect(screen.getByText("Test Description")).toBeInTheDocument();
});

test("shows details when active", () => {
  render(<PhaseCard phase={mockPhase} isActive={true} />);
  expect(screen.getByText("Step 1")).toBeInTheDocument();
  expect(screen.getByText("Step 2")).toBeInTheDocument();
});

test("handles click events", () => {
  const handleClick = vi.fn();
  render(
    <PhaseCard phase={mockPhase} isActive={false} onClick={handleClick} />,
  );

  fireEvent.click(screen.getByText("Test Phase"));
  expect(handleClick).toHaveBeenCalled();
});
