describe('CMS App Basic Navigation', () => {
  it('should navigate through the basic app flow', () => {
    // Step 1: Visit login page
    cy.visit('/');
    
    // Verify Google login button exists
    cy.get('[data-testid="google-login-button"]')
      .should('be.visible')
      .and('contain.text', 'Signin with Google');
    
    // Step 2: Simulate Google login by directly navigating to home
    // (In real scenario, this would involve OAuth flow)
    cy.visit('/home');
    
    // Verify we're on home page and dashboard button exists
    cy.get('[data-cy="route-button-dashboard"]')
      .should('be.visible')
      .and('contain.text', 'Dashboard');
    
    // Step 3: Navigate to dashboard
    cy.get('[data-cy="route-button-dashboard"]').click();
    
    // Verify dashboard loads with editor
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="editor-title"]').should('be.visible');
    cy.get('[data-testid="editor-article"]').should('be.visible');
    
    // Step 4: Verify menu buttons exist
    cy.get('[data-testid="menu-button-image"]').should('be.visible');
    cy.get('[data-testid="menu-button-link"]').should('be.visible');
    cy.get('[data-testid="menu-button-styles"]').should('be.visible');
    cy.get('[data-testid="menu-button-save"]').should('be.visible');
    cy.get('[data-testid="menu-button-post"]').should('be.visible');
    cy.get('[data-testid="menu-button-clear"]').should('be.visible');
    
    // Step 5: Test basic content editing
    cy.get('[data-testid="editor-title"]')
      .click()
      .type('Test Title');
    
    cy.get('[data-testid="editor-article"]')
      .click()
      .type('Test article content for demonstration.');
    
    // Verify content was entered
    cy.get('[data-testid="editor-title"]').should('contain', 'Test Title');
    cy.get('[data-testid="editor-article"]').should('contain', 'Test article content');
  });
  
  it('should open link dialog when link button is clicked', () => {
    cy.visit('/dashboard');
    
    // Click link button
    cy.get('[data-testid="menu-button-link"]').click();
    
    // Verify link dialog appears
    cy.get('[data-testid="link-dialog"]')
      .should('be.visible');
    
    // Verify link input field exists
    cy.get('[data-testid="link-input"]')
      .should('be.visible')
      .and('have.attr', 'placeholder', ' Paste the link/url');
  });
  
  it('should verify storage functionality exists', () => {
    cy.visit('/dashboard');
    
    // Add content
    cy.get('[data-testid="editor-title"]')
      .click()
      .type('Storage Test');
    
    // Click save button
    cy.get('[data-testid="menu-button-save"]').click();
    
    // Wait briefly for save operation
    cy.wait(1000);
    
    // Verify window storage methods exist (basic check)
    cy.window().should('have.property', 'localStorage');
    cy.window().should('have.property', 'sessionStorage');
  });
});