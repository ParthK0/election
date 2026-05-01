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
    // Find the filter button specifically
    const buttons = screen.getAllByRole("button");
    const peopleFilter = buttons.find((b) => b.textContent.trim() === "People");
    fireEvent.click(peopleFilter);

    // Assert logic: Check displayed count
    expect(screen.getByText("2 terms in People")).toBeInTheDocument();
  });
});
