// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import cypress-file-upload
import 'cypress-file-upload'

// Ignore uncaught exceptions that might come from the app
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // on uncaught exceptions. This is useful for third-party scripts
  // like Google Auth that might throw errors we can't control
  return false
})