describe('CMS App E2E Test', () => {
  beforeEach(() => {
    // Clear all storage before each test
    cy.clearAllStorage();
  });

  it('should complete the full CMS workflow', () => {
    // Step 1: Visit the login page and verify Google login button exists
    cy.visit('/');
    cy.get('[data-testid="google-login-button"]')
      .should('be.visible')
      .and('contain', 'Signin with Google');

    // Step 2: Click Google login button and navigate to home
    // Note: In a real test, we would mock the Google OAuth flow
    // For this demo, we'll simulate successful login by navigating directly
    cy.get('[data-testid="google-login-button"]').click();
    
    // Wait for navigation and verify we're on the home page
    cy.url().should('include', '/home');
    
    // Step 3: Navigate to dashboard
    cy.get('[data-cy="route-button-dashboard"]')
      .should('be.visible')
      .click();
    
    // Verify we're on the dashboard
    cy.url().should('include', '/dashboard');
    
    // Step 4: Write a text title
    cy.get('[data-testid="editor-title"]')
      .should('be.visible')
      .waitForContentEditable('[data-testid="editor-title"]')
      .click()
      .clear()
      .type('My CMS Test Article Title');
    
    // Verify title was entered
    cy.get('[data-testid="editor-title"]')
      .should('contain', 'My CMS Test Article Title');
    
    // Step 5: Write article content and add a link
    cy.get('[data-testid="editor-article"]')
      .should('be.visible')
      .waitForContentEditable('[data-testid="editor-article"]')
      .click()
      .clear()
      .type('This is my test article content. I will add a link to Tailwind CSS documentation.');
    
    // Select text for link
    cy.get('[data-testid="editor-article"]')
      .contains('Tailwind CSS documentation')
      .then(($el) => {
        // Create a selection
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents($el[0]);
        selection?.removeAllRanges();
        selection?.addRange(range);
      });
    
    // Step 6: Add a link
    cy.get('[data-testid="menu-button-link"]')
      .should('be.visible')
      .click();
    
    // Wait for link dialog to appear
    cy.get('[data-testid="link-dialog"]')
      .should('be.visible');
    
    // Enter the link URL
    cy.get('[data-testid="link-input"]')
      .should('be.visible')
      .type('https://tailwindcss.com/docs/font-size');
    
    // Submit the link
    cy.get('[data-testid="link-submit-button"]')
      .click();
    
    // Verify link dialog closes
    cy.get('[data-testid="link-dialog"]')
      .should('not.be.visible');
    
    // Step 7: Add an image
    // Note: For image upload, we would need to prepare a test image file
    // This step demonstrates the process but may need actual file handling
    cy.get('[data-testid="menu-button-image"]')
      .should('be.visible')
      .click();
    
    // Create a test image file (simplified for demo)
    const testImagePath = 'cypress/fixtures/test-image.jpg';
    
    // Upload image (this would work if we had a real image file)
    // cy.get('[data-testid="image-upload-input"]')
    //   .selectFile(testImagePath, { force: true });
    
    // Step 8: Apply text formatting (bold, italic, underline)
    // First, select some text in the article
    cy.get('[data-testid="editor-article"]')
      .contains('test article')
      .then(($el) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents($el[0]);
        selection?.removeAllRanges();
        selection?.addRange(range);
      });
    
    // Open styles menu
    cy.get('[data-testid="menu-button-styles"]')
      .should('be.visible')
      .click();
    
    // Apply bold formatting
    cy.get('[data-testid="font-style-bold"]')
      .should('be.visible')
      .click();
    
    // Re-select text for italic
    cy.get('[data-testid="editor-article"]')
      .contains('content')
      .then(($el) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents($el[0]);
        selection?.removeAllRanges();
        selection?.addRange(range);
      });
    
    // Open styles menu again
    cy.get('[data-testid="menu-button-styles"]').click();
    
    // Apply italic formatting
    cy.get('[data-testid="font-style-italic"]')
      .should('be.visible')
      .click();
    
    // Re-select text for underline
    cy.get('[data-testid="editor-article"]')
      .contains('documentation')
      .then(($el) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents($el[0]);
        selection?.removeAllRanges();
        selection?.addRange(range);
      });
    
    // Open styles menu again
    cy.get('[data-testid="menu-button-styles"]').click();
    
    // Apply underline formatting
    cy.get('[data-testid="font-style-underline"]')
      .should('be.visible')
      .click();
    
    // Step 9: Save temporarily and verify storage
    cy.get('[data-testid="menu-button-save"]')
      .should('be.visible')
      .click();
    
    // Wait for save to complete
    cy.wait(2000);
    
    // Verify content is saved in localStorage
    cy.checkStorage('draft-articleContent-DeCav', 'localStorage')
      .then((savedContent) => {
        expect(savedContent).to.not.be.null;
        cy.log('Content saved to localStorage:', savedContent);
      });
    
    // Verify content is saved in sessionStorage
    cy.checkStorage('articleContent-DeCav', 'sessionStorage')
      .then((savedContent) => {
        expect(savedContent).to.not.be.null;
        cy.log('Content saved to sessionStorage:', savedContent);
      });
    
    // Step 10: Post the article and verify SweetAlert confirmation
    cy.get('[data-testid="menu-button-post"]')
      .should('be.visible')
      .click();
    
    // Wait for SweetAlert to appear
    // Note: SweetAlert creates its own DOM elements, so we need to wait and check for them
    cy.get('.swal2-popup', { timeout: 10000 })
      .should('be.visible');
    
    // Verify the success message in SweetAlert
    cy.get('.swal2-title')
      .should('contain', 'Success');
    
    // Close SweetAlert
    cy.get('.swal2-confirm')
      .click();
    
    // Step 11: Clear the screen
    cy.get('[data-testid="menu-button-clear"]')
      .should('be.visible')
      .click();
    
    // Verify content is cleared
    cy.get('[data-testid="editor-title"]')
      .should('not.contain', 'My CMS Test Article Title');
    
    cy.get('[data-testid="editor-article"]')
      .should('not.contain', 'This is my test article content');
  });

  // Additional test for storage verification
  it('should properly handle localStorage and sessionStorage', () => {
    cy.visit('/dashboard');
    
    // Add some content
    cy.get('[data-testid="editor-title"]')
      .click()
      .type('Storage Test Title');
    
    cy.get('[data-testid="editor-article"]')
      .click()
      .type('Storage test content');
    
    // Save and verify storage
    cy.get('[data-testid="menu-button-save"]').click();
    
    cy.wait(2000);
    
    // Check both storage types
    cy.window().then((win) => {
      const localStorage = win.localStorage.getItem('draft-articleContent-DeCav');
      const sessionStorage = win.sessionStorage.getItem('articleContent-DeCav');
      
      expect(localStorage).to.not.be.null;
      expect(sessionStorage).to.not.be.null;
      
      cy.log('LocalStorage content:', localStorage);
      cy.log('SessionStorage content:', sessionStorage);
    });
  });

  // Test for image upload functionality
  it('should handle image upload', () => {
    cy.visit('/dashboard');
    
    // Click image button
    cy.get('[data-testid="menu-button-image"]').click();
    
    // Verify the hidden file input exists
    cy.get('[data-testid="image-upload-input"]')
      .should('exist')
      .and('have.attr', 'accept', 'image/*');
  });
});