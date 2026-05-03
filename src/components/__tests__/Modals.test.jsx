import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect, vi } from "vitest";
import AuthModal from "../AuthModal";
import OnboardingModal from "../OnboardingModal";
import * as useAuthModule from "../../hooks/useAuth";
import * as useElectionModule from "../../hooks/useElection";

describe("Modal Components", () => {
  it("renders AuthModal login and handles submission", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthModalOpen: true,
      closeAuthModal: vi.fn(),
      login: vi.fn(),
      user: null,
    });

    render(<AuthModal />);
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    const { login } = useAuthModule.useAuth();
    expect(login).toHaveBeenCalledWith("test@test.com", "password123");
  });

  it("handles AuthModal signup switching and submission", () => {
    const signupMock = vi.fn();
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthModalOpen: true,
      closeAuthModal: vi.fn(),
      signup: signupMock,
      user: null,
    });

    render(<AuthModal />);
    fireEvent.click(screen.getByText(/Sign Up/i));
    
    expect(screen.getAllByText("Create Account").length).toBeGreaterThan(0);
    
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: "new@test.com" } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "password123" } });

    
    fireEvent.click(screen.getByRole("button", { name: /^Sign Up/i }));
    expect(signupMock).toHaveBeenCalled();
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
