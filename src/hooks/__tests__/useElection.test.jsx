import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useElection } from "../useElection";
import { ElectionProvider } from "../../context/ElectionContext";

// Mock the data imports
vi.mock("../../data/india_loksabha.json", () => ({
  default: {
    id: "india_loksabha",
    name: "Lok Sabha Elections",
    phases: [
      { id: "registration", name: "Registration" },
      { id: "voting", name: "Voting" }
    ],
    glossary: [{ term: "Voter ID", definition: "Identity card" }]
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useElection Hook", () => {
  const wrapper = ({ children }) => (
    <ElectionProvider>{children}</ElectionProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useElection(), { wrapper });
    expect(result.current.country).toBe("india");
    expect(result.current.subCategory).toBe("loksabha");
    expect(result.current.role).toBe("voter");
  });

  it("should update country and language", () => {
    const { result } = renderHook(() => useElection(), { wrapper });
    
    act(() => {
      result.current.setCountry("usa");
    });

    expect(result.current.country).toBe("usa");
  });

  it("should toggle checklist items and update localStorage", () => {
    const { result } = renderHook(() => useElection(), { wrapper });
    
    act(() => {
      result.current.toggleChecklistItem("item_1");
    });

    expect(result.current.checklist["item_1"]).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith("electiq_checklist", JSON.stringify({ item_1: true }));

    act(() => {
      result.current.toggleChecklistItem("item_1");
    });

    expect(result.current.checklist["item_1"]).toBe(false);
  });

  it("should provide correct persona theme based on role", () => {
    const { result } = renderHook(() => useElection(), { wrapper });
    
    act(() => {
      result.current.setRole("candidate");
    });

    expect(result.current.personaTheme.name).toBe("Candidate");
    expect(result.current.personaTheme.icon).toBe("👔");

    act(() => {
      result.current.setRole("unknown");
    });

    expect(result.current.personaTheme.name).toBe("General");
  });

  it("should handle phase transitions", () => {
    const { result } = renderHook(() => useElection(), { wrapper });
    
    act(() => {
      result.current.setCurrentPhase("voting");
    });

    expect(result.current.currentPhase).toBe("voting");
  });
});
