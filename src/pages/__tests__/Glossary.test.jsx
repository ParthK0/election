import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect, vi } from "vitest";
import Glossary from "../Glossary";
import * as useElectionModule from "../../hooks/useElection";

describe("Glossary Page", () => {
  const mockData = {
    glossary: [
      {
        term: "Ballot",
        definition: "A process of voting.",
        category: "Voting",
      },
      {
        term: "Candidate",
        definition:
          "A person who applies for a job or is nominated for election.",
        category: "People",
      },
      {
        term: "Electorate",
        definition:
          "All the people in a country or area who are entitled to vote.",
        category: "People",
      },
    ],
  };

  it("renders glossary terms", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      electionData: mockData,
      country: "india",
    });

    render(<Glossary />);
    expect(screen.getByText("Ballot")).toBeInTheDocument();
    expect(screen.getByText("Candidate")).toBeInTheDocument();
    expect(screen.getByText("Electorate")).toBeInTheDocument();
  });

  it("filters by search term", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      electionData: mockData,
      country: "india",
    });

    render(<Glossary />);
    const searchInput = screen.getByPlaceholderText("Search terms...");
    fireEvent.change(searchInput, { target: { value: "Ballot" } });

    // Assert logic: Check displayed count
    expect(screen.getByText("1 term")).toBeInTheDocument();
    expect(screen.getByText("Ballot")).toBeInTheDocument();
  });

  it("filters by category", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      electionData: mockData,
      country: "india",
    });

    render(<Glossary />);
    // Find the filter button specifically by checking for rounded-full class
    const buttons = screen.getAllByRole("button").filter(b => b.className.includes("rounded-full"));
    const peopleFilter = buttons.find((b) => b.textContent.trim() === "People");
    fireEvent.click(peopleFilter);

    // Assert logic: Check displayed count
    expect(screen.getByText("2 terms in People")).toBeInTheDocument();
  });

  it("clears filters when clear button is clicked", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      electionData: mockData,
      country: "india",
    });

    render(<Glossary />);
    const searchInput = screen.getByPlaceholderText("Search terms...");
    fireEvent.change(searchInput, { target: { value: "Nonexistent" } });

    expect(screen.getByText("0 terms")).toBeInTheDocument();
    
    const clearButton = screen.getByText("Clear filters");
    fireEvent.click(clearButton);

    expect(searchInput.value).toBe("");
    expect(screen.getByText("3 terms")).toBeInTheDocument();
  });

  it("scrolls to letter when sidebar item is clicked", () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      electionData: mockData,
      country: "india",
    });

    render(<Glossary />);
    
    const sidebarB = screen.getByText("B", { selector: "button" });
    fireEvent.click(sidebarB);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("toggles item expansion", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      electionData: mockData,
      country: "india",
    });

    render(<Glossary />);
    const summary = screen.getByText("Ballot").closest("summary");
    const details = summary.closest("details");
    
    // In JSDOM, we need to manually update the open property and trigger the toggle event
    details.open = true;
    fireEvent(details, new Event("toggle"));
    
    expect(summary).toHaveAttribute("aria-expanded", "true");
  });

  it("handles missing glossary data gracefully", () => {
    vi.mocked(useElectionModule.useElection).mockReturnValue({
      electionData: {},
      country: "india",
    });

    const { container } = render(<Glossary />);
    expect(container.firstChild).not.toBeNull(); // Should render layout but no terms
  });

  it("extracts and sorts unique categories", () => {
    const multiCatData = {
      glossary: [
        { term: "A", category: "Z", definition: "desc" },
        { term: "B", category: "A", definition: "desc" },
        { term: "C", category: "M", definition: "desc" },
      ]
    };
    vi.mocked(useElectionModule.useElection).mockReturnValue({
      electionData: multiCatData,
      country: "india",
    });

    render(<Glossary />);
    // Select category buttons by looking for the rounded-full class
    const buttons = screen.getAllByRole("button").filter(b => b.className.includes("rounded-full") && b.className.includes("uppercase"));
    const categories = buttons.map(b => b.textContent.trim());
    
    // Categories should be unique and sorted
    expect(categories).toEqual(["All", "A", "M", "Z"]);
  });
});
