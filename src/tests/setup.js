import "@testing-library/jest-dom";
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock SpeechSynthesisUtterance which is missing in jsdom
global.SpeechSynthesisUtterance = vi.fn().mockImplementation(function(text) {
  this.text = text;
  this.onend = null;
});



vi.mock("../lib/firebase", () => ({
  app: {},
  analytics: { options: {} },
  options: {},
  perf: { trace: () => ({ start: vi.fn(), stop: vi.fn() }) },
  db: {},
  functions: {},
  auth: {},
}));


vi.mock("../api/gemini", () => ({
  askGemini: vi.fn(() => Promise.resolve("Mock AI Response")),
}));


vi.mock("firebase/analytics", () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(() => ({ options: {} })),
}));

vi.mock("firebase/functions", () => ({
  getFunctions: vi.fn(),
  httpsCallable: vi.fn(() => vi.fn(() => Promise.resolve({ data: [] }))),
}));


vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  enableIndexedDbPersistence: vi.fn(() => Promise.resolve()),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(() => vi.fn()), // Returns unsubscribe function
}));

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const actual = await vi.importActual("framer-motion");
  const motionComponent = (tag) => {
    const Component = ({ children, ...props }) => {
      const filteredProps = { ...props };
      ["whileHover", "whileTap", "whileInView", "initial", "animate", "exit", "transition", "layout", "layoutId"].forEach(k => delete filteredProps[k]);
      return React.createElement(tag, filteredProps, children);
    };
    Component.displayName = `Motion${tag.charAt(0).toUpperCase() + tag.slice(1)}`;
    return Component;
  };




  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: motionComponent("div"),
      button: motionComponent("button"),
      span: motionComponent("span"),
      h1: motionComponent("h1"),
      h2: motionComponent("h2"),
      h3: motionComponent("h3"),
      p: motionComponent("p"),
      a: motionComponent("a"),
      section: motionComponent("section"),
      nav: motionComponent("nav"),
    },
    AnimatePresence: ({ children }) => children,
  };
});



vi.mock("react-router-dom", async () => {

  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

