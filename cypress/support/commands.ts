// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to handle Google login simulation
Cypress.Commands.add('loginWithGoogle', () => {
  // In a real test, we would mock the Google OAuth flow
  // For now, we'll simulate the successful login by directly navigating
  cy.visit('/home');
});

// Custom command to wait for content to be editable
Cypress.Commands.add('waitForContentEditable', (selector: string) => {
  cy.get(selector).should('have.attr', 'contenteditable', 'true');
});

// Custom command to check local/session storage
Cypress.Commands.add('checkStorage', (key: string, storageType: 'localStorage' | 'sessionStorage' = 'localStorage') => {
  cy.window().then((win) => {
    const storage = storageType === 'localStorage' ? win.localStorage : win.sessionStorage;
    const value = storage.getItem(key);
    expect(value).to.not.be.null;
    return value;
  });
});

// Custom command to clear storage
Cypress.Commands.add('clearAllStorage', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginWithGoogle(): Chainable<void>
      waitForContentEditable(selector: string): Chainable<JQuery<HTMLElement>>
      checkStorage(key: string, storageType?: 'localStorage' | 'sessionStorage'): Chainable<string | null>
      clearAllStorage(): Chainable<void>
    }
  }
}