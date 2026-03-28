// CHANGE LOG
// Created by : Copilot
// Date       : 2026-03-11
// Reason     : Phase 6 — E2E spec for authentication flow.

describe("01 Auth — login flow", () => {
  it("renders the login form", () => {
    cy.visit("/");
    cy.get('[data-cy="email-input"]').should("be.visible");
    cy.get('[data-cy="password-input"]').should("be.visible");
    cy.get('[data-cy="login-button"]').should("be.visible");
  });

  it("shows an error when credentials are wrong", () => {
    cy.visit("/");
    cy.get('[data-cy="email-input"]').type("wrong@example.com");
    cy.get('[data-cy="password-input"]').type("wrongpassword");
    cy.get('[data-cy="login-button"]').click();
    // URL must stay on the login page
    cy.url().should("not.include", "/home");
  });

  it("redirects an unauthenticated user to / when visiting /dashboard", () => {
    cy.visit("/dashboard");
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });
});

// ─── Non-happy paths ───────────────────────────────────────────────────────
describe("01 Auth — non-happy paths", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("stays on login page when submitting with an empty email field", () => {
    cy.get('[data-cy="password-input"]').type("somepassword");
    cy.get('[data-cy="login-button"]').click();
    cy.url().should("not.include", "/home");
    cy.get('[data-cy="login-button"]').should("exist");
  });

  it("stays on login page when submitting with an empty password field", () => {
    cy.get('[data-cy="email-input"]').type("user@example.com");
    cy.get('[data-cy="login-button"]').click();
    cy.url().should("not.include", "/home");
    cy.get('[data-cy="login-button"]').should("exist");
  });

  it("does not crash when a SQL injection string is entered in the email field", () => {
    cy.get('[data-cy="email-input"]').type("' OR '1'='1'; --");
    cy.get('[data-cy="password-input"]').type("wrongpassword");
    cy.get('[data-cy="login-button"]').click();
    // Page must remain functional and must NOT redirect to /home
    cy.url().should("not.include", "/home");
    cy.get('[data-cy="login-button"]').should("exist");
  });
});
