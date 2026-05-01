import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useAuth } from "../useAuth";
import { useElection } from "../useElection";
import { useChat } from "../useChat";
import React from "react";

// Mock providers
const wrapper = ({ children }) => (
  <div id="providers">
    {children}
  </div>
);

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
