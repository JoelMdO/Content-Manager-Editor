#---
name: code-editing
description: Enforces repository code editing rules.
applyTo: "\*_/_"

---

# Code Editing Skill Instructions

> **Note:** This file documents the Code Editing skill intent and rules. It is formatted as a repository-level skill so the agent can discover and apply these instructions when asked or when `applyTo` patterns match.

This file defines domain-specific skills for code editing agents.

## Best Practices

- Use functional React components and hooks.
- Use the `find-skills` and `vercel-react-best-practices` and `vercel-composition-patterns` and `next-cache-components` where appropiate.
- Prefer `zustand` for state management.
- Follow `tailwind` and `CSS` conventions for styling.
- Consider SOLID principles and clean code practices in all edits.
- Always sanitize user input and HTML content to prevent XSS vulnerabilities.
- Always review the full context of the code being edited to understand its purpose, dependencies, and side effects before making any changes.
- When editing code, follow:

# Rules

### 1. Review Context Before Changing Anything

Before modifying or adding a method, function, variable, or block:

- Read the surrounding code to understand the purpose of the target symbol.
- Check how and where it is called or referenced (callers, consumers, dependencies).
- Understand the data flow: what comes in, what goes out, what side effects exist.
- Do **not** proceed with a change until the full context of the target code is clear.

### 2. Never Overwrite Existing Code — Comment Then Add

When **modifying** existing code:

- **Comment out** the original code block in place. Do not delete it.
- Use the appropriate single-line (`//`, `#`) or block (`/* */`, `""" """`)
  comment syntax for the file's language.
- Immediately **after** the commented block, write the new or updated code.
- The commented original acts as an in-file diff and historical record.

```ts
// ORIGINAL — replaced by: <short reason>
// function calculateTotal(items: Item[]): number {
//   return items.reduce((sum, i) => sum + i.price, 0);
// }

// UPDATED — now applies discount rate
function calculateTotal(items: Item[], discountRate = 0): number {
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  return subtotal * (1 - discountRate);
}
```

### 3. Document Every Change

Immediately after the new code block, add a change comment that records:

| Field          | Content                                                      |
| -------------- | ------------------------------------------------------------ |
| **Changed by** | Author name or `Copilot`                                     |
| **Date**       | ISO-8601 date (`YYYY-MM-DD`)                                 |
| **Reason**     | One sentence explaining _why_ the change was made            |
| **Impact**     | Any side effects, related files touched, or callers affected |

```ts
// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-10
// Reason     : Added discount rate parameter to support promotional pricing.
// Impact     : All callers must be updated to pass discountRate or rely on
//              the default value of 0 (backward compatible).
```

---

### 4. Add Logs.

When modifying existing code, especially if it involves complex logic or side effects, consider adding logging statements to help trace the execution flow and debug potential issues in the future. Use a consistent logging format and include relevant information such as variable values, function names, and execution points.

```ts
// UPDATED — added logging for debugging purposes
function calculateTotal(items: Item[], discountRate = 0): number {
  console.log("Calculating total for items:", items);
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  console.log("Subtotal before discount:", subtotal);
  const total = subtotal * (1 - discountRate);
  console.log("Total after applying discount rate:", total);
  return total;
}
```

### 5. Follow Project Conventions and Best Practices

- Adhere to the coding style and conventions established in the project (e.g., naming conventions, file structure, formatting).
- Follow best practices for the specific programming language and framework used in the repository.
- Ensure that your code is clean, readable, and maintainable. Avoid unnecessary complexity and strive for clarity in your implementations.

### 6. Prioritize Security and Performance

- Always consider the security implications of your changes. Sanitize user input, handle sensitive data securely, and avoid introducing vulnerabilities such as XSS, SQL injection, or data leaks.
- Optimize for performance where applicable, especially in critical code paths. Avoid inefficient algorithms or unnecessary computations that could degrade the performance of the application.

### 7. Communicate Changes Clearly

- When making significant changes, consider adding comments in the code to explain the rationale behind the changes, especially if the logic is complex or non-obvious.

### 8. Add a Log.

When modifying existing code, especially if it involves complex logic or side effects, consider adding logging as a new md document which should be located on the `ChangeLogs/` directory. If the Change is for the Editor will be added `ChangeLogs/Editor` for the API will be added `ChangeLogs/API` and for the Content-Manager-Editor-Backend will be added `ChangeLogs/CMSBackend` and for Docker will be added `ChangeLogs/Docker`, the name of the file will be based on the change. This helps trace the execution flow and debug potential issues in the future. Use a consistent logging format and include relevant information such as general overview, need of changes, variable values, function names, original code, execution points and new changes as well the test related to this changes with a report of the test.

## Quick Reference Checklist

- [ ] I have read the function/method/variable and its callers.
- [ ] The original code is **commented out**, not deleted.
- [ ] The new code appears **directly after** the commented block.
- [ ] A change-log comment is added **after** the new code.
- [ ] I have added logging statements if the change involves complex logic or side effects.
- [ ] I have written a change-log entry for the modifications.

## Skill Usage

- Use this skill to guide code editing agents in following best practices and project-specific conventions.

---

_Last updated: March 12, 2026_.
