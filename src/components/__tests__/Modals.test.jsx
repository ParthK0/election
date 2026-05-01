import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect, vi } from "vitest";
import AuthModal from "../AuthModal";
import OnboardingModal from "../OnboardingModal";
import * as useAuthModule from "../../hooks/useAuth";
import * as useElectionModule from "../../hooks/useElection";

describe("Modal Components", () => {
  it("renders AuthModal when open and allows switching", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthModalOpen: true,
      closeAuthModal: vi.fn(),
      login: vi.fn(),
      user: null,
    });

    render(<AuthModal />);
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    
    // Switch to signup
    const switchBtn = screen.getByText(/Sign Up/i);
    fireEvent.click(switchBtn);
    expect(screen.getAllByText("Create Account").length).toBeGreaterThan(0);
  });

  it("renders OnboardingModal and allows navigation", () => {
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      setCountry: vi.fn(),
      role: "voter",
      checklist: {},
    });

    render(<OnboardingModal />);
    expect(screen.getByText("Welcome to ElectIQ")).toBeInTheDocument();
    
    const nextBtn = screen.getByRole("button", { name: /personalize/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Choose the election/i)).toBeInTheDocument();
  });
});
