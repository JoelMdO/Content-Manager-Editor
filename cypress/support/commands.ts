// =============================================================
// Custom Cypress commands for the Blog Editor app
// =============================================================

// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-11
// Reason     : Fix TS errors:
//              1. Added `export {}` to make this file an ES module —
//                 required for `declare global` to be valid.
//              2. Moved type augmentation ABOVE the Commands.add calls.
//              3. Changed `Chainable<void>` → `Chainable` (no generic
//                 needed in augmentation context).
//              4. Added explicit `string` parameter type for dbName to
//                 prevent `unknown` inference.
//              5. Added uploadTestImage command for Phase 6 image tests.
// Impact     : All cypress/e2e specs get cy.login(), cy.selectDb(),
//              cy.typeInEditor(), and cy.uploadTestImage() automatically.

export {};

// -------------------------------------------------------------
// TypeScript global augmentation — must come before Commands.add
// -------------------------------------------------------------
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable;
      selectDb(dbName?: string): Chainable;
      typeInEditor(index: number, content: string): Chainable;
      /**
       * Triggers the hidden file input with a minimal synthetic PNG so the
       * image-upload flow can be tested without a real fixture binary.
       */
      uploadTestImage(): Chainable;
    }
  }
}

// -------------------------------------------------------------
// cy.login(email?, password?)
// Authenticates via the credentials form and caches the session.
// -------------------------------------------------------------
Cypress.Commands.add("login", (email?: string, password?: string) => {
  const _email = email ?? Cypress.env("testEmail");
  const _password = password ?? Cypress.env("testPassword");
  cy.session(
    [_email, _password],
    () => {
      cy.visit("/");
      cy.get('[data-cy="email-input"]').type(_email);
      cy.get('[data-cy="password-input"]').type(_password);
      cy.get('[data-cy="login-button"]').click();
      cy.url().should("include", "/home");
    },
    { cacheAcrossSpecs: true },
  );
});

// -------------------------------------------------------------
// cy.selectDb(dbName?)
// Writes the db name into sessionStorage so the dashboard
// skips the SweetAlert db-selector dialog.
// -------------------------------------------------------------
Cypress.Commands.add("selectDb", (dbName: string = "DeCav") => {
  cy.window().then((win) => {
    win.sessionStorage.setItem("db", dbName);
    win.sessionStorage.setItem("dbName", dbName);
  });
});

// -------------------------------------------------------------
// cy.typeInEditor(index, content)
// Sets innerHTML of contentEditable div at `index` (0=title, 1=body)
// and fires the input event so debounced save handlers are triggered.
// -------------------------------------------------------------
Cypress.Commands.add("typeInEditor", (index: number, content: string) => {
  cy.get('[contenteditable="true"]')
    .eq(index)
    .click()
    .then(($el) => {
      const el = $el[0];
      el.focus();
      el.innerHTML = content;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
});

// -------------------------------------------------------------
// cy.uploadTestImage()
// Triggers the hidden file input with a 1×1 transparent PNG
// created in memory — no fixture binary file required.
// Intercept POST /api/hub before calling this command so the
// clean-image validation returns 200.
// -------------------------------------------------------------
Cypress.Commands.add("uploadTestImage", () => {
  // Minimal 1×1 transparent PNG (base64)
  const PNG_1x1 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  cy.get('[data-cy="file-input"]').selectFile(
    {
      contents: Cypress.Buffer.from(PNG_1x1, "base64"),
      fileName: "test-image.png",
      mimeType: "image/png",
    },
    { force: true }, // input is hidden
  );
});
