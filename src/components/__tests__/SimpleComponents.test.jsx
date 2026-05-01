import { render, screen } from "../../tests/test-utils";
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

  it("renders CursorGlow correctly", () => {
    const { container } = render(<CursorGlow />);
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
