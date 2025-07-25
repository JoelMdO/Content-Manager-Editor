// ***********************************************
// Custom commands for CMS E2E testing
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login via Google (mocked for testing)
       */
      loginViaGoogle(): Chainable<void>
      
      /**
       * Custom command to wait for element to be visible and enabled
       */
      waitForElement(selector: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Custom command to type in contentEditable elements
       */
      typeInEditor(selector: string, text: string): Chainable<void>
      
      /**
       * Custom command to select text in editor
       */
      selectTextInEditor(selector: string, text: string): Chainable<void>
    }
  }
}

// Mock Google login for testing
Cypress.Commands.add('loginViaGoogle', () => {
  // Since we can't test actual Google OAuth in Cypress easily,
  // we'll create a mock session or use a test account
  cy.window().then((win) => {
    // Mock the session storage for authentication
    win.sessionStorage.setItem('auth-token', 'mock-token')
    // You might need to adjust this based on your auth implementation
  })
})

Cypress.Commands.add('waitForElement', (selector: string) => {
  return cy.get(selector, { timeout: 10000 }).should('be.visible').and('not.be.disabled')
})

Cypress.Commands.add('typeInEditor', (selector: string, text: string) => {
  cy.get(selector)
    .click()
    .clear()
    .type(text, { delay: 50 })
})

Cypress.Commands.add('selectTextInEditor', (selector: string, text: string) => {
  cy.get(selector).then(($el) => {
    const el = $el[0]
    const document = el.ownerDocument
    const window = document.defaultView
    const range = document.createRange()
    const selection = window?.getSelection()
    
    // Find the text node containing the text
    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      null
    )
    
    let textNode
    while (textNode = walker.nextNode()) {
      if (textNode.textContent?.includes(text)) {
        const startIndex = textNode.textContent.indexOf(text)
        range.setStart(textNode, startIndex)
        range.setEnd(textNode, startIndex + text.length)
        selection?.removeAllRanges()
        selection?.addRange(range)
        break
      }
    }
  })
})

export {}