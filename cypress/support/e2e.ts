// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global configurations
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // for expected errors during development
  if (err.message.includes('Network request failed') || 
      err.message.includes('Firebase') ||
      err.message.includes('Non-Error promise rejection captured')) {
    return false
  }
  return true
})

// Add custom commands to handle authentication
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to mock Google OAuth login
       * @example cy.mockGoogleLogin()
       */
      mockGoogleLogin(): Chainable<void>
      
      /**
       * Custom command to check localStorage content
       * @example cy.checkLocalStorage('key', 'expectedValue')
       */
      checkLocalStorage(key: string, expectedValue?: string): Chainable<void>
      
      /**
       * Custom command to check sessionStorage content
       * @example cy.checkSessionStorage('key', 'expectedValue')
       */
      checkSessionStorage(key: string, expectedValue?: string): Chainable<void>
      
      /**
       * Custom command to wait for SweetAlert
       * @example cy.waitForSweetAlert()
       */
      waitForSweetAlert(): Chainable<void>
      
      /**
       * Custom command to type in contenteditable div
       * @example cy.typeInEditor('content', 0)
       */
      typeInEditor(content: string, index: number): Chainable<void>
    }
  }
}