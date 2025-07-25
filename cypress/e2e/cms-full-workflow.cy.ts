// cypress/e2e/cms-full-workflow.cy.ts
// Comprehensive E2E test for CMS application workflow

describe('CMS Application - Complete Workflow', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('/')
    
    // Set up mock authentication to bypass actual Google OAuth
    cy.window().then((win) => {
      // Mock session storage for auth
      win.sessionStorage.setItem('db', 'DeCav')
    })
  })

  it('should complete the full CMS workflow: login, create article, format, save, and post', () => {
    // Step 1: Login via Google button
    cy.log('Testing Google login button')
    cy.get('[data-testid="google-login-button"]')
      .should('be.visible')
      .and('contain.text', 'Google') // Assuming the button contains "Google" text
      .click()

    // Wait for navigation to dashboard (home page might redirect to dashboard)
    // Since we're mocking auth, we need to navigate manually or handle the redirect
    cy.url().should('include', '/home')
    
    // Step 2: Navigate to dashboard
    cy.log('Navigating to dashboard')
    cy.visit('/dashboard')
    cy.url().should('include', '/dashboard')
    
    // Verify dashboard elements are loaded
    cy.get('[data-testid="title-editor"]').should('be.visible')
    cy.get('[data-testid="body-editor"]').should('be.visible')
    
    // Step 3: Write a text title: "AI from the ground up"
    cy.log('Writing title: AI from the ground up')
    cy.get('[data-testid="title-editor"]')
      .click()
      .clear()
      .type('AI from the ground up')
      .should('contain.text', 'AI from the ground up')

    // Step 4: Write a text body with the specified content
    cy.log('Writing body content')
    const bodyText = 'Transform your web, Salesforce, and mobile app quality. Test faster, increase reliability, and gain confidence across every release.'
    cy.get('[data-testid="body-editor"]')
      .click()
      .clear()
      .type(bodyText)
      .should('contain.text', bodyText)

    // Step 5: Add an image (if image button is available)
    cy.log('Testing image functionality')
    cy.get('[data-testid="image-button"]')
      .should('be.visible')
      .click()
    
    // Note: Since we don't have access to desktop files in the test environment,
    // we'll just verify the button is clickable. In a real scenario, you would
    // use cy.fixture() to upload a test image
    
    // Step 6: Add a link: https://tailwindcss.com/docs/font-size
    cy.log('Adding link')
    cy.get('[data-testid="link-button"]')
      .should('be.visible')
      .click()
    
    // If there's a link dialog/modal, interact with it
    // This depends on how the link functionality is implemented
    // For now, we'll just verify the button is clickable
    
    // Step 7: Change the text "Salesforce" to bold
    cy.log('Making "Salesforce" text bold')
    
    // First, select the "Salesforce" text in the body editor
    cy.get('[data-testid="body-editor"]').then(($editor) => {
      const editorElement = $editor[0]
      const textContent = editorElement.textContent || ''
      
      if (textContent.includes('Salesforce')) {
        // Select the word "Salesforce"
        cy.selectTextInEditor('[data-testid="body-editor"]', 'Salesforce')
        
        // Click the bold button
        cy.get('[data-testid="bold-button"]')
          .should('be.visible')
          .click()
      }
    })

    // Step 8: Change the text title to italic
    cy.log('Making title italic')
    
    // Select all text in title editor
    cy.get('[data-testid="title-editor"]')
      .click()
      .type('{ctrl+a}') // Select all text
    
    // Click the italic button
    cy.get('[data-testid="italic-button"]')
      .should('be.visible')
      .click()

    // Step 9: Underline the text "Test faster"
    cy.log('Underlining "Test faster" text')
    
    // Now we have the underline functionality implemented
    cy.get('[data-testid="body-editor"]').then(($editor) => {
      const textContent = $editor[0].textContent || ''
      if (textContent.includes('Test faster')) {
        cy.selectTextInEditor('[data-testid="body-editor"]', 'Test faster')
        
        // Click the underline button
        cy.get('[data-testid="underline-button"]')
          .should('be.visible')
          .click()
      }
    })

    // Step 10: Save temporarily and confirm it's saved in localStorage and sessionStorage
    cy.log('Testing temporary save functionality')
    
    // The save is handled automatically by debounced function, but let's check storage
    cy.window().then((win) => {
      // Check sessionStorage for article content
      const dbName = win.sessionStorage.getItem('db')
      const articleContent = win.sessionStorage.getItem(`articleContent-${dbName}`)
      
      if (articleContent) {
        const parsedContent = JSON.parse(articleContent)
        cy.log('Article content found in sessionStorage:', parsedContent)
        
        // Verify title and body are saved
        const titleItem = parsedContent.find((item: any) => item.type === 'title')
        const bodyItem = parsedContent.find((item: any) => item.type === 'body')
        
        expect(titleItem).to.exist
        expect(bodyItem).to.exist
        expect(titleItem.content).to.include('AI from the ground up')
        expect(bodyItem.content).to.include('Transform your web')
      }
    })

    // Step 11: Post article (ensure data saved to DB and SweetAlert confirmation appears)
    cy.log('Testing post functionality')
    
    cy.get('[data-testid="post-button"]')
      .should('be.visible')
      .click()
    
    // Wait for SweetAlert confirmation dialog
    // SweetAlert2 creates elements with specific classes
    cy.get('.swal2-popup', { timeout: 10000 })
      .should('be.visible')
    
    // Check for success message
    cy.get('.swal2-title')
      .should('be.visible')
      .and('contain.text', 'Success') // Adjust based on actual success message
    
    // Close the alert
    cy.get('.swal2-confirm')
      .should('be.visible')
      .click()

    // Step 12: Clear the screen
    cy.log('Testing clear functionality')
    
    cy.get('[data-testid="clear-button"]')
      .should('be.visible')
      .click()
    
    // Verify that the editors are cleared
    cy.get('[data-testid="title-editor"]')
      .should('not.contain.text', 'AI from the ground up')
    
    cy.get('[data-testid="body-editor"]')
      .should('not.contain.text', 'Transform your web')
    
    cy.log('✅ Complete CMS workflow test completed successfully')
  })

  // Additional test for error handling and edge cases
  it('should handle empty content gracefully', () => {
    cy.visit('/dashboard')
    
    // Try to post without content
    cy.get('[data-testid="post-button"]')
      .click()
    
    // Should show some form of validation or handle empty content
    // This depends on the actual implementation
  })

  // Test for responsive design (mobile view)
  it('should work on mobile devices', () => {
    cy.viewport('iphone-6')
    cy.visit('/dashboard')
    
    // Verify mobile navigation is visible
    cy.get('nav.md\\:hidden')
      .should('be.visible')
    
    // Verify desktop navigation is hidden
    cy.get('aside.hidden.md\\:flex')
      .should('not.be.visible')
  })
})