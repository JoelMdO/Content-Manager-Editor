// CHANGE LOG
// Created by : Copilot
// Date       : 2026-03-11
// Reason     : Phase 6 — E2E spec for draft loading.
//              Critical regression guard for the paragraph-collapse bug
//              (Phase 2+3): loading a draft must NOT wipe out the existing
//              multi-paragraph content of the body editor.

import draftFixture from "../fixtures/draft.json";

describe("03 Draft — loading a draft preserves multi-paragraph content", () => {
  beforeEach(() => {
    cy.login();
    // Seed localStorage with the draft fixture so the sidebar shows it
    cy.visit("/dashboard");
    cy.selectDb(draftFixture.dbName);

    cy.window().then((win) => {
      win.localStorage.setItem(
        draftFixture.draftKey,
        JSON.stringify(draftFixture.draftContent)
      );
    });

    cy.reload();
  });

  it("shows the draft title in the sidebar", () => {
    // The DraftArticle component reads DRAFT_KEY from the store and
    // renders the title text from localStorage
    cy.contains(draftFixture.draftContent[0].content).should("be.visible");
  });

  it("loads the EN draft without collapsing paragraphs", () => {
    cy.get('[data-cy="draft-load-draft-en"]').click();

    // All three paragraphs must survive the load
    cy.get('[data-cy="editor-body"]').within(() => {
      cy.get("p").should("have.length.at.least", 3);
      cy.contains("Paragraph one in draft.").should("exist");
      cy.contains("Paragraph two in draft.").should("exist");
      cy.contains("Paragraph three in draft.").should("exist");
    });
  });

  it("sets the title editor after loading EN draft", () => {
    cy.get('[data-cy="draft-load-draft-en"]').click();
    cy.get('[data-cy="editor-title"]').should(
      "contain.text",
      draftFixture.draftContent[0].content
    );
  });
});

// ─── Non-happy paths ───────────────────────────────────────────────────────
describe("03 Draft — non-happy paths", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/dashboard");
    cy.selectDb(draftFixture.dbName);
  });

  it("editor loads without crash when localStorage contains invalid JSON", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(draftFixture.draftKey, "{ invalid json {{{{");
    });
    cy.reload();

    // Both editors must still render — invalid JSON must not white-screen the app
    cy.get('[data-cy="editor-title"]').should("be.visible");
    cy.get('[data-cy="editor-body"]').should("be.visible");
  });

  it("clicking load-draft when no draft is stored keeps the title editor empty", () => {
    // No draft seeded — reload with empty storage
    cy.window().then((win) => {
      win.localStorage.removeItem(draftFixture.draftKey);
    });
    cy.reload();

    // The load button may be hidden when there's no draft; if visible click it
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="draft-load-draft-en"]').length) {
        cy.get('[data-cy="draft-load-draft-en"]').click();
      }
    });

    cy.get('[data-cy="editor-title"]').should(
      "not.contain.text",
      draftFixture.draftContent[0].content,
    );
  });

  it("loading a partial draft (title only, no body entry) leaves body editor empty", () => {
    const titleOnlyDraft = [{ type: "title", content: "Title Only Draft" }];
    cy.window().then((win) => {
      win.localStorage.setItem(draftFixture.draftKey, JSON.stringify(titleOnlyDraft));
    });
    cy.reload();

    cy.get('[data-cy="draft-load-draft-en"]').click();

    cy.get('[data-cy="editor-body"]').then(($el) => {
      // Body should contain no meaningful text — just empty/placeholder markup
      const text = $el.text().trim();
      expect(text).to.be.empty;
    });
  });
});
