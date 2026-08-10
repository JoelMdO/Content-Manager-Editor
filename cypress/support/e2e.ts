// =============================================================
// Entry point for Cypress E2E support — loaded before every spec.
// =============================================================

// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-11
// Reason     : Bootstrap Cypress support layer: custom commands.
//              Removed cypress-file-upload import — Cypress 14 ships with
//              the built-in .selectFile() command which is used instead.
// Impact     : All E2E specs get cy.login(), cy.selectDb(),
//              cy.typeInEditor(), and cy.uploadTestImage() automatically.

import "./commands";
