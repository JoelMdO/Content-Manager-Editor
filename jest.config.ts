import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Points to the Next.js app root so next.config.ts and .env files are loaded
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}",
    "<rootDir>/src/**/*.test.{ts,tsx}",
  ],
  collectCoverageFrom: [
    "src/store/**/*.{ts,tsx}",
    "src/lib/**/*.{ts,tsx}",
    "src/components/dashboard/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
  ],
};

// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-11
// Reason     : Initial Jest configuration for Next.js 15 with jsdom environment.
// Impact     : Enables `pnpm test` to run unit tests in src/store/, src/lib/,
//              and src/components/dashboard/__tests__/ folders.

export default createJestConfig(config);
