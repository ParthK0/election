import { render, screen, fireEvent } from "../../tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OnboardingModal from "../OnboardingModal";
import * as useElectionModule from "../../hooks/useElection";

vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(() => ({ options: {} })),
}));

describe("OnboardingModal Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      setCountry: vi.fn(),
      role: "voter",
      setRole: vi.fn(),
    });
  });

  it("renders when no electiq_onboarded in localStorage", () => {
    render(<OnboardingModal />);
    expect(screen.getByText(/Welcome to ElectIQ/i)).toBeInTheDocument();
  });

  it("does not render when electiq_onboarded is true", () => {
    localStorage.setItem("electiq_onboarded", "true");
    render(<OnboardingModal />);
    expect(screen.queryByText(/Welcome to ElectIQ/i)).not.toBeInTheDocument();
  });

  it("advances steps when clicking personalization button", () => {
    render(<OnboardingModal />);
    const personalizeBtn = screen.getByRole("button", { name: /personalize/i });
    fireEvent.click(personalizeBtn);

    expect(screen.getByText(/Select Region/i)).toBeInTheDocument();
  });

  it("selects country and advances", () => {
    const setCountry = vi.fn();
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      setCountry,
      role: "voter",
      setRole: vi.fn(),
    });

    render(<OnboardingModal />);
    fireEvent.click(screen.getByRole("button", { name: /personalize/i }));
    
    const usaBtn = screen.getByText("USA");
    fireEvent.click(usaBtn);
    expect(setCountry).toHaveBeenCalledWith("usa");

    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    expect(screen.getByText(/Select Role/i)).toBeInTheDocument();
  });

  it("completes onboarding on finish", () => {
    render(<OnboardingModal />);
    fireEvent.click(screen.getByRole("button", { name: /personalize/i })); // Step 1 -> 2
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));    // Step 2 -> 3
    fireEvent.click(screen.getByRole("button", { name: /Finish Setup/i })); // Step 3 -> finish

    
    expect(localStorage.getItem("electiq_onboarded")).toBe("true");
    expect(screen.queryByText(/Welcome to ElectIQ/i)).not.toBeInTheDocument();
  });

  it("skips onboarding on skip button", () => {
    render(<OnboardingModal />);
    fireEvent.click(screen.getByText(/Skip/i));
    expect(localStorage.getItem("electiq_onboarded")).toBe("true");
    expect(screen.queryByText(/Welcome to ElectIQ/i)).not.toBeInTheDocument();
  });
});
