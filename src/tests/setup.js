import "@testing-library/jest-dom";
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Clean up after each test
afterEach(() => {
  cleanup();
});

vi.mock("../lib/firebase", () => ({
  app: {},
  analytics: { options: {} },
  options: {},
  perf: { trace: () => ({ start: vi.fn(), stop: vi.fn() }) },
  db: {},
  functions: {},
}));

vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(() => ({ options: {} })),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});
