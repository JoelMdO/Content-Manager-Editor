# Copilot Instructions

## General Guidelines

- Place this file in the `.github` folder for easy access and logical grouping with other project guidelines.
- Ensure all changes made by Copilot or manually follow these instructions.

## Code Preservation

- For every change made to the code, the original code must be preserved as comments.
- Add a comment block at the top of the file to indicate that the original code is preserved.
- Comment out the original code using `//`.

```javascript
//==========================================
// Original Code (Preserved for Reference)
//==========================================
// function exampleFunction() {
//   console.log("Original code");
// }

// Updated Code
function exampleFunction() {
  console.log("Updated code");
}
```

## Commenting Changes

- Every change to a function, component, or logic block must include a comment explaining the purpose of the change.
- Use a clear and concise format for the comments.

## Test Cases

- For every new function created (either by Copilot or manually), add a corresponding test case to validate its functionality.
- Ensure the test case is compatible with the current environment and can be executed without additional setup.

## Comment Format

- Each function, `useEffect`, or significant logic block must include a comment explaining its purpose. Use the following format:
  ```javascript
  //------------------------------------------
  // Purpose: This function handles the post request for saving the article.
  //------------------------------------------
  ```
