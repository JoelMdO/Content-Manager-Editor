/// <reference types="cypress" />

describe('CMS E2E Test - Complete User Flow', () => {
  const TEST_TITLE = 'AI from the ground up'
  const TEST_BODY = 'Transform your web, Salesforce, and mobile app quality. Test faster, increase reliability, and gain confidence across every release.'
  const TEST_LINK = 'https://tailwindcss.com/docs/font-size'

  beforeEach(() => {
    // Mock Google OAuth and session
    cy.mockGoogleLogin()
    
    // Clear storage before each test
    cy.window().then((win) => {
      win.localStorage.clear()
      win.sessionStorage.clear()
    })
    
    // Intercept API calls
    cy.intercept('POST', '**/api/post', {
      statusCode: 200,
      body: { success: true, message: 'Article saved successfully' }
    }).as('saveArticle')
    
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
    }).as('session')
  })

  it('should complete the full CMS workflow', () => {
    // Step 1: Login via Google button
    cy.log('**Step 1: Login via Google**')
    cy.visit('/')
    cy.get('[data-testid="google-signin-button"]').should('be.visible')
    cy.get('[data-testid="google-signin-button"]').click()
    cy.wait('@googleSignIn')

    // Should redirect to home page after login
    cy.url().should('include', '/home')
    cy.get('[data-testid="dashboard-button"]').should('be.visible')

    // Step 2: Navigate to dashboard
    cy.log('**Step 2: Navigate to dashboard**')
    cy.get('[data-testid="dashboard-button"]').click()
    cy.url().should('include', '/dashboard')

    // Verify dashboard elements are present
    cy.get('[data-testid="title-editor"]').should('be.visible')
    cy.get('[data-testid="body-editor"]').should('be.visible')
    cy.get('[data-testid="image-button"]').should('be.visible')
    cy.get('[data-testid="link-button"]').should('be.visible')
    cy.get('[data-testid="font-style-ui"]').should('be.visible')

    // Step 3: Write a text title
    cy.log('**Step 3: Write title**')
    cy.get('[data-testid="title-editor"]').click().clear()
    cy.get('[data-testid="title-editor"]').type(TEST_TITLE)
    
    // Verify title was entered
    cy.get('[data-testid="title-editor"]').should('contain', TEST_TITLE)

    // Step 4: Write a text body
    cy.log('**Step 4: Write body content**')
    cy.get('[data-testid="body-editor"]').click().clear()
    cy.get('[data-testid="body-editor"]').type(TEST_BODY)
    
    // Verify body was entered
    cy.get('[data-testid="body-editor"]').should('contain', TEST_BODY)

    // Step 5: Add an image (simulating image upload)
    cy.log('**Step 5: Add an image**')
    cy.get('[data-testid="image-button"]').click()
    
    // Wait for potential image dialog/modal and handle it
    cy.get('body').then($body => {
      // Check if file input exists and simulate file selection
      if ($body.find('input[type="file"]').length) {
        // Create a test image file
        const fileName = 'test-image.jpg'
        cy.fixture('images/test-image.jpg', 'base64').then(fileContent => {
          cy.get('input[type="file"]').then(input => {
            const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg')
            const file = new File([blob], fileName, { type: 'image/jpeg' })
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            input[0].files = dataTransfer.files
            cy.wrap(input).trigger('change', { force: true })
          })
        })
      }
    })

    // Step 6: Add a link
    cy.log('**Step 6: Add a link**')
    cy.get('[data-testid="body-editor"]').click()
    
    // Select some text to add link to
    cy.get('[data-testid="body-editor"]').then($editor => {
      const editor = $editor[0]
      
      // Select "Test faster" text for linking
      const range = document.createRange()
      const textNode = Array.from(editor.childNodes).find(node => 
        node.textContent && node.textContent.includes('Test faster')
      )
      
      if (textNode) {
        const startIndex = textNode.textContent.indexOf('Test faster')
        range.setStart(textNode, startIndex)
        range.setEnd(textNode, startIndex + 'Test faster'.length)
        
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      }
    })

    cy.get('[data-testid="link-button"]').click()
    
    // Handle link input dialog
    cy.get('body').then($body => {
      if ($body.find('input[type="url"], input[placeholder*="link"], input[placeholder*="URL"]').length) {
        cy.get('input[type="url"], input[placeholder*="link"], input[placeholder*="URL"]')
          .first()
          .type(TEST_LINK)
        
        // Look for confirm/OK button
        cy.get('button').contains(/ok|confirm|add|insert/i).click()
      }
    })

    // Step 7: Change "Salesforce" to bold
    cy.log('**Step 7: Make "Salesforce" bold**')
    cy.get('[data-testid="body-editor"]').then($editor => {
      const editor = $editor[0]
      
      // Select "Salesforce" text
      const range = document.createRange()
      const textNode = Array.from(editor.childNodes).find(node => 
        node.textContent && node.textContent.includes('Salesforce')
      )
      
      if (textNode) {
        const startIndex = textNode.textContent.indexOf('Salesforce')
        range.setStart(textNode, startIndex)
        range.setEnd(textNode, startIndex + 'Salesforce'.length)
        
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      }
    })
    
    cy.get('[data-testid="bold-button"]').click()

    // Step 8: Change the text title to italic
    cy.log('**Step 8: Make title italic**')
    cy.get('[data-testid="title-editor"]').then($editor => {
      const editor = $editor[0]
      
      // Select all title text
      const range = document.createRange()
      range.selectNodeContents(editor)
      
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    })
    
    cy.get('[data-testid="italic-button"]').click()

    // Step 9: Underline "Test faster" text
    cy.log('**Step 9: Underline "Test faster"**')
    cy.get('[data-testid="body-editor"]').then($editor => {
      const editor = $editor[0]
      
      // Select "Test faster" text
      const range = document.createRange()
      const textNode = Array.from(editor.childNodes).find(node => 
        node.textContent && node.textContent.includes('Test faster')
      )
      
      if (textNode) {
        const startIndex = textNode.textContent.indexOf('Test faster')
        range.setStart(textNode, startIndex)
        range.setEnd(textNode, startIndex + 'Test faster'.length)
        
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      }
    })
    
    cy.get('[data-testid="underline-button"]').click()

    // Step 10: Save temporarily and confirm storage
    cy.log('**Step 10: Verify temporary save in storage**')
    
    // Wait for debounced save to trigger
    cy.wait(1000)
    
    // Check sessionStorage for temporary content
    cy.window().then((win) => {
      const dbName = win.sessionStorage.getItem('db') || 'DeCav'
      
      // Check for temporary title and body
      const tempTitle = win.sessionStorage.getItem(`tempTitle-${dbName}`)
      const tempBody = win.sessionStorage.getItem(`tempBody-${dbName}`)
      const articleContent = win.sessionStorage.getItem(`articleContent-${dbName}`)
      
      expect(tempTitle || '').to.include(TEST_TITLE)
      expect(tempBody || '').to.include('Salesforce')
      expect(articleContent).to.not.be.null
      
      if (articleContent) {
        const parsed = JSON.parse(articleContent)
        expect(parsed).to.be.an('array')
        expect(parsed.some(item => item.type === 'title')).to.be.true
        expect(parsed.some(item => item.type === 'body')).to.be.true
      }
    })

    // Also check localStorage if applicable
    cy.checkSessionStorage('db')

    // Step 11: Post and ensure SweetAlert confirmation
    cy.log('**Step 11: Post article and verify SweetAlert**')
    cy.get('[data-testid="post-button"]').click()
    
    // Wait for the API call
    cy.wait('@saveArticle')
    
    // Wait for SweetAlert to appear
    cy.waitForSweetAlert()
    
    // Verify SweetAlert content
    cy.get('.swal2-title').should('contain', 'success')
    cy.get('.swal2-html-container, .swal2-content').should('be.visible')

    // Step 12: Clear the screen
    cy.log('**Step 12: Clear the screen**')
    
    // Close SweetAlert if it's still open
    cy.get('body').then($body => {
      if ($body.find('.swal2-confirm').length) {
        cy.get('.swal2-confirm').click()
      }
    })
    
    cy.get('[data-testid="clear-button"]').click()
    
    // Verify content is cleared
    cy.get('[data-testid="title-editor"]').should('not.contain', TEST_TITLE)
    cy.get('[data-testid="body-editor"]').should('not.contain', TEST_BODY)
    
    // Verify placeholders are back
    cy.get('[data-testid="title-editor"]').should('contain', 'Title here...')
    cy.get('[data-testid="body-editor"]').should('contain', 'Write your Article here...')
  })

  // Additional test for individual components
  it('should handle individual component interactions', () => {
    cy.mockGoogleLogin()
    cy.visit('/')
    cy.get('[data-testid="google-signin-button"]').click()
    cy.wait('@googleSignIn')
    cy.get('[data-testid="dashboard-button"]').click()

    // Test font style buttons independently
    cy.get('[data-testid="bold-button"]').should('be.visible').and('contain', 'B')
    cy.get('[data-testid="italic-button"]').should('be.visible').and('contain', 'I')
    cy.get('[data-testid="underline-button"]').should('be.visible').and('contain', 'U')

    // Test that editors are contenteditable
    cy.get('[data-testid="title-editor"]').should('have.attr', 'contenteditable', 'true')
    cy.get('[data-testid="body-editor"]').should('have.attr', 'contenteditable', 'true')

    // Test that buttons are clickable
    cy.get('[data-testid="image-button"]').should('not.be.disabled')
    cy.get('[data-testid="link-button"]').should('not.be.disabled')
    cy.get('[data-testid="post-button"]').should('not.be.disabled')
    cy.get('[data-testid="clear-button"]').should('not.be.disabled')
  })
})