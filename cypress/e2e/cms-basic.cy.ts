/// <reference types="cypress" />

describe('CMS Basic Functionality Test', () => {
  beforeEach(() => {
    // Mock authentication
    cy.mockGoogleLogin()
    
    // Clear storage
    cy.window().then((win) => {
      win.localStorage.clear()
      win.sessionStorage.clear()
    })
  })

  it('should load the homepage and show login button', () => {
    cy.visit('/')
    cy.get('[data-testid="google-signin-button"]').should('be.visible')
    cy.get('[data-testid="google-signin-button"]').should('contain', 'Sign In')
  })

  it('should navigate to home after mocked login', () => {
    cy.visit('/')
    cy.get('[data-testid="google-signin-button"]').click()
    cy.wait('@googleSignIn')
    
    // Should be redirected to home
    cy.url().should('include', '/home')
    cy.get('[data-testid="dashboard-button"]').should('be.visible')
  })

  it('should navigate to dashboard and show editor', () => {
    cy.visit('/')
    cy.get('[data-testid="google-signin-button"]').click()
    cy.wait('@googleSignIn')
    
    cy.get('[data-testid="dashboard-button"]').click()
    cy.url().should('include', '/dashboard')
    
    // Check that main elements are present
    cy.get('[data-testid="title-editor"]').should('be.visible')
    cy.get('[data-testid="body-editor"]').should('be.visible')
    cy.get('[data-testid="font-style-ui"]').should('be.visible')
  })

  it('should allow typing in editors', () => {
    cy.visit('/')
    cy.get('[data-testid="google-signin-button"]').click()
    cy.wait('@googleSignIn')
    cy.get('[data-testid="dashboard-button"]').click()
    
    // Type in title
    cy.get('[data-testid="title-editor"]').click().type('Test Title')
    cy.get('[data-testid="title-editor"]').should('contain', 'Test Title')
    
    // Type in body
    cy.get('[data-testid="body-editor"]').click().type('Test body content')
    cy.get('[data-testid="body-editor"]').should('contain', 'Test body content')
  })

  it('should have working font style buttons', () => {
    cy.visit('/')
    cy.get('[data-testid="google-signin-button"]').click()
    cy.wait('@googleSignIn')
    cy.get('[data-testid="dashboard-button"]').click()
    
    // Check font style buttons
    cy.get('[data-testid="bold-button"]').should('be.visible').and('contain', 'B')
    cy.get('[data-testid="italic-button"]').should('be.visible').and('contain', 'I')
    cy.get('[data-testid="underline-button"]').should('be.visible').and('contain', 'U')
    
    // Test clicking them (basic interaction)
    cy.get('[data-testid="bold-button"]').click()
    cy.get('[data-testid="italic-button"]').click()
    cy.get('[data-testid="underline-button"]').click()
  })
})