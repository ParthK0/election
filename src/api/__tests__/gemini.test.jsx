import { describe, it, expect } from "vitest";
import { askGemini } from "../gemini";

describe("Gemini API", () => {
  it("askGemini is defined", () => {
    expect(askGemini).toBeDefined();
  });
});
