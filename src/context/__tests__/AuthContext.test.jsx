import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthProvider } from "../AuthContext";
import { useAuth } from "../../hooks/useAuth";

const TestAuthComponent = () => {
  const { user, login, logout, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.name : "none"}</div>
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
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("test");
    });

    fireEvent.click(screen.getByText("Logout"));
    expect(screen.getByTestId("user").textContent).toBe("none");
  });
});
