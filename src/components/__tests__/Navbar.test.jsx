import { render, screen, fireEvent, act } from "../../tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navbar from "../Navbar";
import * as useAuthModule from "../../hooks/useAuth";
import * as useElectionModule from "../../hooks/useElection";

vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(() => ({ options: {} })),
}));

// Mock focus-trap-react to avoid tabbable node error in tests
vi.mock("focus-trap-react", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

describe("Navbar Component", () => {
  beforeEach(() => {
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
  });

  it("renders brand name", () => {
    render(<Navbar />);
    expect(screen.getAllByText(/ElectIQ/i).length).toBeGreaterThan(0);
  });

  it("opens and closes mobile menu", () => {
    render(<Navbar />);
    const menuBtn = screen.getByLabelText(/Open menu/i);
    fireEvent.click(menuBtn);
    expect(screen.getAllByLabelText(/Close menu/i).length).toBeGreaterThan(0);

    
    const closeBtn = screen.getAllByLabelText(/Close menu/i)[0];
    fireEvent.click(closeBtn);

    expect(screen.getByLabelText(/Open menu/i)).toBeInTheDocument();
  });

  it("opens role dropdown and switches role", () => {
    const setRole = vi.fn();
    vi.spyOn(useElectionModule, "useElection").mockReturnValue({
      country: "india",
      role: "voter",
      setRole,
    });

    render(<Navbar />);
    const roleBtn = screen.getByText(/Viewing as:/i);
    fireEvent.click(roleBtn);
    
    const candidateBtn = screen.getByText("Candidate");
    fireEvent.click(candidateBtn);
    expect(setRole).toHaveBeenCalledWith("candidate");
  });

  it("calls logout when logout button is clicked", () => {
    const logout = vi.fn();
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: { displayName: "Test User" },
      logout,
      openAuthModal: vi.fn(),
    });

    render(<Navbar />);
    const logoutBtn = screen.getByTitle(/Logout/i);
    fireEvent.click(logoutBtn);
    expect(logout).toHaveBeenCalled();
  });

  it("dispatches open-preferences event on settings click", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    render(<Navbar />);
    const settingsBtn = screen.getByTitle(/Preferences/i);
    fireEvent.click(settingsBtn);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
    expect(dispatchSpy.mock.calls[0][0].type).toBe("open-preferences");
  });

  it("applies scrolled class on scroll", async () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation", { name: "Main Navigation" });
    
    // Initial state
    expect(nav.className).toContain("py-4");
    
    // Simulate scroll
    act(() => {
      window.scrollY = 20;
      window.dispatchEvent(new Event("scroll"));
    });
    
    expect(nav.className).toContain("py-3");
    expect(nav.className).toContain("bg-dark-surface/80");
  });

  it("calls openAuthModal when Sign In button is clicked", () => {
    const openAuthModal = vi.fn();
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: null,
      logout: vi.fn(),
      openAuthModal,
    });

    render(<Navbar />);
    const signInBtn = screen.getByText(/Sign In/i);
    fireEvent.click(signInBtn);
    expect(openAuthModal).toHaveBeenCalled();
  });
});
