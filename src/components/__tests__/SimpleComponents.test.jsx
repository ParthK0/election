import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect } from "vitest";
import EmptyState from "../EmptyState";
import Skeleton from "../Skeleton";
import CursorGlow from "../CursorGlow";

describe("Simple UI Components", () => {
  it("renders EmptyState correctly", () => {
    render(<EmptyState message="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders Skeleton correctly", () => {
    const { container } = render(<Skeleton className="w-10" />);
    expect(container.firstChild).toHaveClass("w-10");
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("renders CursorGlow and responds to mouse move", () => {
    render(<CursorGlow />);
    fireEvent.mouseMove(window, { clientX: 100, clientY: 200 });
    // CursorGlow uses framer-motion, testing exact position in JSDOM is hard,
    // but we can at least ensure it doesn't crash and is present.
    expect(screen.getByTestId("cursor-glow")).toBeInTheDocument();
  });
});
