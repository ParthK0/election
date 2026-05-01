import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect, vi } from "vitest";
import Navbar from "../Navbar";
import * as useElectionModule from "../../hooks/useElection";
import * as useAuthModule from "../../hooks/useAuth";

vi.mock("focus-trap-react", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

describe("Navbar Component", () => {
  it("renders brand name and navigation links", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      role: "voter",
      setRole: vi.fn(),
    });
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: null,
      logout: vi.fn(),
      openAuthModal: vi.fn(),
    });

    render(<Navbar />);
    expect(screen.getByText("ElectIQ")).toBeInTheDocument();
    
    // Toggle mobile menu
    const menuBtn = screen.getByLabelText("Open menu");
    fireEvent.click(menuBtn);
    expect(screen.getAllByLabelText("Close menu")[0]).toBeInTheDocument();
  });

  it("shows user name when logged in", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      role: "voter",
      setRole: vi.fn(),
    });
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: { name: "John Doe" },
      logout: vi.fn(),
      openAuthModal: vi.fn(),
    });

    render(<Navbar />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
