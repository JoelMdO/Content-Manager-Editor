// Custom commands for CMS E2E testing

// Mock Google OAuth login
Cypress.Commands.add('mockGoogleLogin', () => {
  // Intercept Google OAuth requests and mock successful response
  cy.intercept('POST', '**/api/auth/signin/google', {
    statusCode: 200,
    body: { url: '/home' }
  }).as('googleSignIn')
  
  cy.intercept('GET', '**/api/auth/session', {
    statusCode: 200,
    body: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  }).as('getSession')
  
  cy.intercept('GET', '**/api/auth/csrf', {
    statusCode: 200,
    body: { csrfToken: 'mock-csrf-token' }
  }).as('getCsrf')
})

// Check localStorage content
Cypress.Commands.add('checkLocalStorage', (key: string, expectedValue?: string) => {
  cy.window().then((win) => {
    const value = win.localStorage.getItem(key)
    if (expectedValue) {
      expect(value).to.equal(expectedValue)
    } else {
      expect(value).to.not.be.null
    }
  })
})

// Check sessionStorage content
Cypress.Commands.add('checkSessionStorage', (key: string, expectedValue?: string) => {
  cy.window().then((win) => {
    const value = win.sessionStorage.getItem(key)
    if (expectedValue) {
      expect(value).to.equal(expectedValue)
    } else {
      expect(value).to.not.be.null
    }
  })
})

// Wait for SweetAlert to appear
Cypress.Commands.add('waitForSweetAlert', () => {
  cy.get('.swal2-container', { timeout: 10000 }).should('be.visible')
})

// Type in contenteditable div
Cypress.Commands.add('typeInEditor', (content: string, index: number) => {
  cy.get('[contenteditable="true"]').eq(index).then($el => {
    // Clear existing content first
    $el.get(0).innerHTML = ''
    // Focus and type new content
    cy.wrap($el).focus().type(content, { delay: 50 })
  })
})

// Select text within an element
Cypress.Commands.add('selectText', { prevSubject: 'element' }, (subject, text: string) => {
  cy.wrap(subject).then($el => {
    const element = $el[0]
    const textContent = element.textContent || ''
    const startIndex = textContent.indexOf(text)
    
    if (startIndex !== -1) {
      const range = document.createRange()
      const selection = window.getSelection()
      
      // Find the text node containing our text
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
      )
      
      let textNode: Node | null = null
      let currentOffset = 0
      
      while (walker.nextNode()) {
        const node = walker.currentNode
        const nodeText = node.textContent || ''
        
        if (currentOffset + nodeText.length > startIndex) {
          textNode = node
          break
        }
        currentOffset += nodeText.length
      }
      
      if (textNode) {
        const nodeStartIndex = startIndex - currentOffset
        range.setStart(textNode, nodeStartIndex)
        range.setEnd(textNode, nodeStartIndex + text.length)
        
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  })
})