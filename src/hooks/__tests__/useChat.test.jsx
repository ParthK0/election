import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useChat } from "../useChat";
import { ChatProvider } from "../../context/ChatContext";

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

describe("useChat Hook", () => {
  const wrapper = ({ children }) => (
    <ChatProvider>{children}</ChatProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with empty chat history if nothing in localStorage", () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.chatHistory).toEqual([]);
  });

  it("should initialize with history from localStorage", () => {
    localStorage.setItem("electiq_chat", JSON.stringify([{ role: "user", content: "hello" }]));
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.chatHistory).toEqual([{ role: "user", content: "hello" }]);
  });

  it("should set chat history and update localStorage", () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    const newHistory = [{ role: "user", content: "test" }];
    
    act(() => {
      result.current.setChatHistory(newHistory);
    });

    expect(result.current.chatHistory).toEqual(newHistory);
    expect(localStorage.setItem).toHaveBeenCalledWith("electiq_chat", JSON.stringify(newHistory));
  });

  it("should clear history", () => {
    localStorage.setItem("electiq_chat", JSON.stringify([{ role: "user", content: "hello" }]));
    const { result } = renderHook(() => useChat(), { wrapper });

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.chatHistory).toEqual([]);
    expect(localStorage.removeItem).toHaveBeenCalledWith("electiq_chat");
  });

  it("should handle loading and error states", () => {
    const { result } = renderHook(() => useChat(), { wrapper });

    act(() => {
      result.current.setIsLoading(true);
      result.current.setError("test error");
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe("test error");
  });

  it("should cap history at 50 messages (simulated via effect)", () => {
    const largeHistory = Array.from({ length: 60 }, (_, i) => ({ role: "user", content: `${i}` }));
    const { result } = renderHook(() => useChat(), { wrapper });

    act(() => {
      result.current.setChatHistory(largeHistory);
    });

    // The useEffect in ChatContext caps it at 50
    // Note: useEffect runs after render, so we check localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith("electiq_chat", expect.stringContaining(JSON.stringify(largeHistory.slice(-50))));
  });
});
