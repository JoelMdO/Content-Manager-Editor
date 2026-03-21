# CME

Content Management Editor: Text Rich Editor, to write your blog articles and get it ready to publish on your website or app.

The CME is designed to help developers and writers streamline their writing process, has a backend AI LLM to get the article translated and create a summary.

---

## 🚀 Features

### ✍️ Blog Article Editor

- Write and manage articles with ease.
- Text Rich.
- Images and links insertion.
- Publish-ready content.

---

## 📂 Use Cases

- **Blogging:** Publish blog posts directly to your blog.
- **IA Translator:** Interface with an own Python API to translate the articles, using Mistral LLM, through Ollama.

---

## 🛠 Tech Stack

- **Frontend:** React / Next.js
- **Backend:** Next.js / Firebase / CloudFlare / Python
- **Database:** Firestore / Realtime DB
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth

---

## ⚙️ GitHub Actions

The repository uses five active GitHub Actions workflows to automate security, dependency management, deployment, and code quality.

---

### 🔐 CodeQL — Security Scanning

**Purpose:** Automatically scans the codebase for security vulnerabilities using GitHub's CodeQL static analysis engine.

- Runs on a **scheduled basis** (and on every push/PR to `main`).
- Analyses JavaScript/TypeScript source files for common vulnerability patterns (e.g. injection, XSS, insecure data flow).
- Results are surfaced in the **Security → Code scanning** tab on GitHub.
- Helps catch vulnerabilities before they reach production.

---

### 📦 Dependabot Updates — Automated Dependency Management

**Purpose:** Keeps npm/yarn dependencies up to date automatically by opening pull requests when new package versions are released.

- Monitors the project's `package.json` for outdated or vulnerable packages.
- Creates automated PRs with the proposed version bumps.
- Works in tandem with CodeQL and the Copilot code review to ensure updates are both safe and correctly integrated.

---

### 🌐 pages-build-deployment — GitHub Pages CI/CD

**Purpose:** Builds the Next.js application and deploys it to **GitHub Pages** on every merge to `main`.

- Triggered automatically after a successful push to the default branch.
- Runs `next build` (or exports static output) and publishes the result to the `gh-pages` environment.
- Makes the latest version of the app publicly accessible via the repository's GitHub Pages URL.

---

### 🤖 Copilot Code Review — Automated PR Reviews

**Purpose:** Uses **GitHub Copilot** to perform an automated code review on every pull request.

- Activated when a pull request is opened or updated.
- Copilot analyses the diff and posts inline comments, suggestions, and summary feedback directly on the PR.
- Acts as a first-pass reviewer to catch bugs, style issues, and potential improvements before a human review.

---

### 🛠️ Copilot Coding Agent — AI-Assisted Development

**Purpose:** Enables **GitHub Copilot's SWE (Software Engineering) agent** to autonomously handle issues and tasks assigned to it.

- Triggered when an issue or task is assigned to `@copilot` or via the Copilot workspace.
- The agent analyses the issue, explores the codebase, implements the required changes, and opens a pull request.
- Designed to accelerate feature development and bug fixes with minimal manual intervention.

---
