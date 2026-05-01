import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect, vi } from "vitest";
import ShareButton from "../ShareButton";
import GlossaryChip from "../GlossaryChip";
import Skeleton from "../Skeleton";

vi.mock("../../hooks/useElection", () => ({ useElection: () => ({ country: "india" }) }));
vi.mock("../../hooks/useChat", () => ({ useChat: () => ({ setChatHistory: vi.fn() }) }));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Utility Components", () => {
  it("renders ShareButton and handles click", async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<ShareButton text="Share this" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining(window.location.href));
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });

  it("renders GlossaryChip and handles click", () => {
    render(<GlossaryChip term="Voter" />);
    const button = screen.getByText("Ask AI");
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith("/ask");
  });

  it("renders Skeleton", () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
