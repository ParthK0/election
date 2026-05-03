import { describe, it, expect } from "vitest";
import { useAuth } from "../useAuth";
import { useElection } from "../useElection";
import { useChat } from "../useChat";

describe("Custom Hooks", () => {
  it("useAuth should be a function", () => {
    expect(typeof useAuth).toBe("function");
  });

  it("useElection should be a function", () => {
    expect(typeof useElection).toBe("function");
  });

  it("useChat should be a function", () => {
    expect(typeof useChat).toBe("function");
  });
});
