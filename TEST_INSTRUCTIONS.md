# CMS E2E Testing with Cypress - Implementation Report

Please switch to the e2eTest and create a Cypress E2E test for my CMS app that covers these flows:

Login via Google button
After sucessfull login
Navigate to dashboard page
Select from the dialog the db DeCav
Go to sections, open the dialog and select "Flight Operations"
Write text "My new article for test" on title
Add on Article div (body): - Write a text as "How to write a new article for aviation" - Add an image, before testing ask and check if you can access and open the input or if you need an URL from my documents images so you can retrieve the image.
Add a link "https://www.google.com/articles/mexico"
Change text "new article" from the body to bold
Change text "aviation" from the body to italic
Underline the text "How"
Save temporarily and confirm it’s saved in both localStorage and sessionStorage
Click on translate and check (ensure the dialog showing text "Translating" is poped up) the spanish version is shown on the Title and Article
Click on Post (ensure data saved to DB and SweetAlert confirmation dialog appears)
Clear the screen
Use optimal file naming and structure for Cypress.
If needed, add unique data-testid attributes to the app’s components for reliable selector targeting.
After generating the test, execute it, and provide the results in a readable markdown report.
If any step fails, explain why, and suggest fixes or improvements.
