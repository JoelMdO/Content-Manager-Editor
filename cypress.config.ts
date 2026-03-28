import { defineConfig } from "cypress";

// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-11
// Reason     : Initial Cypress E2E configuration targeting the Next.js dev server.
// Impact     : `pnpm cypress:open` and `pnpm cypress:run` now have a valid config.
//              All E2E specs live in cypress/e2e/*.cy.ts.

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    env: {
      // Override via cypress.env.json (git-ignored) or --env flag in CI
      testEmail: "test@example.com",
      testPassword: "testpassword",
    },
  },
});
