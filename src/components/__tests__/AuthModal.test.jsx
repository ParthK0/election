import { render, screen, fireEvent, waitFor } from "../../tests/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthModal from "../AuthModal";
import * as useAuthModule from "../../hooks/useAuth";

vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(() => ({ options: {} })),
}));

describe("AuthModal Component", () => {
  beforeEach(() => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthModalOpen: true,
      closeAuthModal: vi.fn(),
      login: vi.fn(),
      signup: vi.fn(),
    });
  });

  it("renders when open", () => {
    render(<AuthModal />);
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
  });

  it("switches between login and signup", () => {
    render(<AuthModal />);
    const toggleBtn = screen.getByText(/Sign Up/i);
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
  });

  it("shows error when fields are empty", async () => {
    render(<AuthModal />);
    const submitBtn = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitBtn);
    expect(screen.getByText(/Please fill in all fields/i)).toBeInTheDocument();
  });

  it("calls login with email and password", async () => {
    const login = vi.fn().mockResolvedValue();
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthModalOpen: true,
      closeAuthModal: vi.fn(),
      login,
      signup: vi.fn(),
    });

    render(<AuthModal />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));
    
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("calls signup with email and password", async () => {
    const signup = vi.fn().mockResolvedValue();
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthModalOpen: true,
      closeAuthModal: vi.fn(),
      login: vi.fn(),
      signup,
    });

    render(<AuthModal />);
    fireEvent.click(screen.getByText(/Sign Up/i));
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    
    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith("new@example.com", "password123");
    });
  });

  it("handles various authentication errors", async () => {
    const login = vi.fn()
      .mockRejectedValueOnce({ code: "auth/user-not-found" });
    const signup = vi.fn()
      .mockRejectedValueOnce({ code: "auth/email-already-in-use" })
      .mockRejectedValueOnce({ code: "auth/weak-password" })
      .mockRejectedValueOnce({ code: "other-error" });

    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthModalOpen: true,
      closeAuthModal: vi.fn(),
      login,
      signup,
    });

    const { rerender } = render(<AuthModal />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole("button", { name: /Sign In/i });

    // User not found
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passInput, { target: { value: "pass" } });
    fireEvent.click(submitBtn);
    await waitFor(() => expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument());

    // Email in use (switch to signup)
    fireEvent.click(screen.getByTestId("auth-toggle"));
    const signupBtn = screen.getByRole("button", { name: /Sign Up/i });
    fireEvent.click(signupBtn);
    await waitFor(() => expect(screen.getByText(/This email is already registered/i)).toBeInTheDocument());

    // Weak password
    fireEvent.click(signupBtn);
    await waitFor(() => expect(screen.getByText(/Password should be at least 6 characters/i)).toBeInTheDocument());

    // Other error
    fireEvent.click(signupBtn);
    await waitFor(() => expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument());
  });

  it("closes when close button is clicked", () => {
    const closeAuthModal = vi.fn();
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthModalOpen: true,
      closeAuthModal,
      login: vi.fn(),
      signup: vi.fn(),
    });

    render(<AuthModal />);
    fireEvent.click(screen.getByLabelText(/Close authentication modal/i));
    expect(closeAuthModal).toHaveBeenCalled();
  });

  it("closes when overlay is clicked", () => {
    const closeAuthModal = vi.fn();
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthModalOpen: true,
      closeAuthModal,
      login: vi.fn(),
      signup: vi.fn(),
    });

    const { container } = render(<AuthModal />);
    // The overlay is the first motion.div inside the fixed div
    const overlay = container.querySelector(".absolute.inset-0.bg-black\\/80");
    fireEvent.click(overlay);
    expect(closeAuthModal).toHaveBeenCalled();
  });
});
