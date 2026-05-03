import { render, screen } from "../../tests/test-utils";
import { describe, it, expect } from "vitest";
import Sources from "../Sources";

describe("Sources Page", () => {
  it("renders page title and header", () => {
    render(<Sources />);
    expect(screen.getByText("Our Sources")).toBeInTheDocument();
    expect(screen.getByText(/official government election commissions/i)).toBeInTheDocument();
  });

  it("renders transparency notice", () => {
    render(<Sources />);
    expect(screen.getByText(/never expresses political opinions/i)).toBeInTheDocument();
  });

  it("renders all countries sections", () => {
    render(<Sources />);
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();
  });

  it("renders specific source items with correct links", () => {
    render(<Sources />);
    const eciLink = screen.getByText("Election Commission of India (ECI)");
    expect(eciLink).toBeInTheDocument();
    expect(eciLink.closest("a")).toHaveAttribute("href", "https://eci.gov.in");
    
    const voteGovLink = screen.getByText("Vote.gov");
    expect(voteGovLink).toBeInTheDocument();
    expect(voteGovLink.closest("a")).toHaveAttribute("href", "https://vote.gov");
  });

  it("renders footer CTA link to ask page", () => {
    render(<Sources />);
    const cta = screen.getByText(/Ask Our AI/i);
    expect(cta.closest("a")).toHaveAttribute("href", "/ask");
  });
});
