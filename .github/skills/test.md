#---
---
name: code-testing
description: Enforces repository testing rules (TDD-first, changelogs, frameworks).
applyTo: "src/**/*.{ts,tsx,js,jsx,mdx}"

---

# Code Testing Skill

> **Note:** This file documents the Code Testing skill intent and rules. It is formatted as a repository-level skill so the agent can discover and apply these instructions when asked or when `applyTo` patterns match.

## Purpose

Define the standard procedure that must be followed every time code is tested, modified, or extended in this repository.

## Instructions

### 1. Add Tests for New or Modified Code

Whenever you add new functionality or modify existing code, add or update tests to cover the changes. Prefer real inputs/values; if you must mock, request approval for the mock data and scope. Use the `find-skills` and `test-driven-development` skills where appropriate.

Prefer `jest` for unit tests and `Cypress` for integration/e2e, but ask for approval before choosing alternate frameworks.

```ts
// NEW TEST — added to cover discount rate functionality
test("calculateTotal applies discount rate correctly", () => {
  const items = [{ price: 100 }, { price: 50 }];
  const discountRate = 0.2; // 20% discount
  const total = calculateTotal(items, discountRate);
  expect(total).toBe(120); // (100 + 50) * (1 - 0.2) = 120
});
```

### 2. Add a Change Log

When creating or modifying tests—especially for complex logic or side effects—add a changelog entry under the `ChangeLogs/` directory. Use subfolders per area: `ChangeLogs/Editor`, `ChangeLogs/API`, `ChangeLogs/CMSBackend`, `ChangeLogs/Docker`. File names should start with `TEST-` and describe the change.

Include: overview, reason for change, affected functions, original code snippet, new code snippet, and test summary/results.

## Quick Reference Checklist

- [ ] I have read the function/method/variable and its callers.
- [ ] I have added or updated tests to cover the new or modified code.
- [ ] I have written a change-log entry for the modifications.

## How the Agent Will Use This Skill

The agent will apply these rules when explicitly instructed or when a skill-aware prompt references this skill. To request behavior, include the skill name and desired outcome in your prompt (examples below).

## Example Prompts (copy/paste)

- "Use the `code-testing` skill and `test-driven-development` to add a failing Jest test for `app/services/translation.py:translate()` that rejects empty input, run tests, implement minimal fix, then refactor."
- "Apply `code-testing` to this change: add unit tests for `calculateTotal` and create a `ChangeLogs/Editor/TEST-calculateTotal.md` entry."
- "Follow `code-testing`: write tests for new API endpoint `POST /articles`, run the test suite, and add changelog."

If you want this skill to auto-run for specific directories, update `applyTo` to a narrower glob.

---
