import { render, screen, fireEvent } from "@testing-library/react";

import { describe, it, expect, vi } from "vitest";
import { AuthProvider } from "../AuthContext";
import { useAuth } from "../../hooks/useAuth";
import * as FirebaseAuth from "firebase/auth";

const TestAuthComponent = () => {
  const { user, login, logout, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? (user.displayName || user.email) : "none"}</div>
      <div data-testid="modal">{isAuthModalOpen ? "open" : "closed"}</div>
      <button onClick={() => login("test@example.com", "password")}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={openAuthModal}>Open</button>
      <button onClick={closeAuthModal}>Close</button>
    </div>
  );
};

describe("AuthContext", () => {
  it("manages auth state and modals", async () => {
    // Mock successful login
    const loginSpy = vi.spyOn(FirebaseAuth, "signInWithEmailAndPassword").mockResolvedValue({
      user: { uid: "123", email: "test@example.com", displayName: "Test User" }
    });
    const logoutSpy = vi.spyOn(FirebaseAuth, "signOut").mockResolvedValue();

    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("none");
    expect(screen.getByTestId("modal").textContent).toBe("closed");

    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByTestId("modal").textContent).toBe("open");

    fireEvent.click(screen.getByText("Login"));
    expect(loginSpy).toHaveBeenCalledWith(expect.anything(), "test@example.com", "password");

    fireEvent.click(screen.getByText("Logout"));
    expect(logoutSpy).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.getByTestId("modal").textContent).toBe("closed");
  });
});

