// CHANGE LOG
// Created by : Copilot
// Date       : 2026-03-11
// Reason     : Phase 6 — E2E spec for basic editor rendering and input.
// Pre-condition : Requires a running Next.js dev/prod server and valid
//                credentials in cypress.env.json.

describe("02 Editor basic — dashboard renders and accepts input", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/dashboard");
    cy.selectDb("DeCav");
    // Reload so the dashboard picks up sessionStorage immediately
    cy.reload();
  });

  it("renders the title and body contentEditable divs", () => {
    cy.get('[data-cy="editor-title"]')
      .should("be.visible")
      .and("have.attr", "contenteditable", "true");

    cy.get('[data-cy="editor-body"]')
      .should("be.visible")
      .and("have.attr", "contenteditable", "true");
  });

  it("accepts typed content in the title editor", () => {
    cy.typeInEditor(0, "Hello World Title");
    cy.get('[data-cy="editor-title"]').should("contain.text", "Hello World Title");
  });

  it("accepts typed content in the body editor", () => {
    const body = "<p>First paragraph.</p><p>Second paragraph.</p>";
    cy.typeInEditor(1, body);
    cy.get('[data-cy="editor-body"]').should("contain.text", "First paragraph.");
    cy.get('[data-cy="editor-body"]').should("contain.text", "Second paragraph.");
  });

  it("shows the auto-save indicator after content is entered", () => {
    cy.typeInEditor(0, "Auto-save test title");
    cy.typeInEditor(1, "<p>Body content for auto-save test</p>");
    // Auto-save indicator may appear after the debounce interval
    cy.get('[data-cy="auto-save-indicator"]', { timeout: 10000 }).should(
      "be.visible"
    );
  });
});

// ─── Non-happy paths ───────────────────────────────────────────────────────
describe("02 Editor — non-happy paths", () => {
  it("shows a db-selector dialog when visiting /dashboard without a db in sessionStorage", () => {
    cy.login();
    // Deliberately do NOT call cy.selectDb() so sessionStorage has no db key
    cy.visit("/dashboard");
    // SweetAlert2 popup must appear asking to select a database
    cy.get(".swal2-popup", { timeout: 8000 }).should("be.visible");
  });

  it("XSS payload in the title editor does not execute scripts", () => {
    cy.login();
    cy.visit("/dashboard");
    cy.selectDb("DeCav");
    cy.reload();

    cy.typeInEditor(0, '<script>window.__xss_attacked__ = true;</script>');

    // No <script> element must exist inside the title editor
    cy.get('[data-cy="editor-title"] script').should("not.exist");
    // The XSS flag must not have been set on the window object
    cy.window().then((win) => {
      expect((win as any).__xss_attacked__).to.be.undefined;
    });
  });

  it("editor body remains interactive after receiving focus on an empty document", () => {
    cy.login();
    cy.visit("/dashboard");
    cy.selectDb("DeCav");
    cy.reload();

    // Click the empty body editor — should not crash or remove contenteditable
    cy.get('[data-cy="editor-body"]').click();
    cy.get('[data-cy="editor-body"]').should(
      "have.attr",
      "contenteditable",
      "true",
    );
  });
});
