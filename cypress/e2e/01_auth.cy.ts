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

// ─── Password reset flow ───────────────────────────────────────────────────
// handleSendResetLink() calls callHub("password-reset", { email }),
// which POSTs to NEXT_PUBLIC_url_api/api/hub — intercepted below.
describe("01 Auth — password reset flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("reveals the password reset form when the forgot-password button is clicked", () => {
    cy.get('[data-cy="reset-email-input"]').should("not.be.visible");
    cy.get('[data-cy="forgot-password-button"]').click();
    cy.get('[data-cy="reset-email-input"]').should("be.visible");
  });

  it("calls the hub with password-reset and shows a generic success message on submit", () => {
    cy.intercept("POST", "**/api/hub", {
      statusCode: 200,
      body: {
        status: 200,
        message:
          "If this email exists, a password reset link has been generated",
      },
    }).as("resetRequest");

    cy.get('[data-cy="forgot-password-button"]').click();
    cy.get('[data-cy="reset-email-input"]').type("user@example.com");
    cy.get('[data-cy="send-reset-button"]').click();

    cy.wait("@resetRequest");
    // The reset form should hide after submission
    cy.get('[data-cy="reset-email-input"]').should("not.be.visible");
  });

  it("shows the same generic success message for an unknown email (no enumeration)", () => {
    cy.intercept("POST", "**/api/hub", {
      statusCode: 200,
      body: {
        status: 200,
        message:
          "If this email exists, a password reset link has been generated",
      },
    }).as("resetRequest");

    cy.get('[data-cy="forgot-password-button"]').click();
    cy.get('[data-cy="reset-email-input"]').type("unknown@noone.com");
    cy.get('[data-cy="send-reset-button"]').click();

    cy.wait("@resetRequest");
    cy.get('[data-cy="reset-email-input"]').should("not.be.visible");
  });

  it("shows a Google account management hint when the reset form is open", () => {
    cy.get('[data-cy="forgot-password-button"]').click();
    cy.contains("myaccount.google.com").should("be.visible");
  });

  it("hides the reset form when Cancel is clicked", () => {
    cy.get('[data-cy="forgot-password-button"]').click();
    cy.get('[data-cy="reset-email-input"]').should("be.visible");
    cy.get('[data-cy="reset-cancel-button"]').click();
    cy.get('[data-cy="reset-email-input"]').should("not.be.visible");
  });
});
