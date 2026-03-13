# AGENTS.md — Editor

## Overview

Next.js 15 (TypeScript) frontend application. Allows authenticated users to create, draft, and publish HTML articles. Supports rich text editing, image/link insertion, bilingual UI (English/Spanish), autosave via `localStorage`/`sessionStorage`, and integration with an external Python AI API for translation and article summarisation.

---

## Tech Stack

| Concern           | Library / Tool                           |
| ----------------- | ---------------------------------------- |
| Framework         | Next.js 15 (App Router)                  |
| Language          | TypeScript                               |
| Styling           | Tailwind CSS                             |
| State             | Zustand                                  |
| Auth              | next-auth 4 (credentials + Google OAuth) |
| Database          | Firebase (auth) + Firebase Realtime DB   |
| Image hosting     | Cloudinary                               |
| HTML sanitisation | dompurify / sanitize-html                |
| Notifications     | SweetAlert2                              |
| Icons             | lucide-react                             |
| Data fetching     | SWR                                      |
| Package manager   | pnpm                                     |

---

## Directory Layout

```
src/
├── app/                         # App Router pages
│   ├── page.tsx                 # Login page
│   ├── home/                    # Home / landing
│   ├── dashboard/               # Main article editor
│   ├── playbook/                # Playbook note creation
│   ├── readPlaybook/            # Read saved playbook entries
│   └── api/                     # Next.js route handlers
│       ├── auth/                # next-auth callback
│       ├── post/                # Publish article to CMS
│       ├── save/                # Save draft
│       ├── translate/           # Proxy → Python /translate
│       ├── summary/             # Proxy → Python /resume
│       ├── search/              # Article search
│       ├── hub/                 # Hub data
│       └── markdown/            # Markdown utilities
├── components/
│   ├── alerts/                  # SweetAlert2 helpers (success, error, db_selector…)
│   ├── buttons/                 # Reusable buttons (logo, logout, home, loader…)
│   ├── dashboard/
│   │   ├── dashboard_editor.tsx # Core contentEditable editor component
│   │   ├── draft_article/       # Draft listing and loading UI
│   │   ├── hooks/
│   │   │   ├── useGetInitialArticleDraft.ts    # Load persisted draft on mount
│   │   │   └── useTranslatedArticleDraft.ts    # Handle translation result updates
│   │   ├── language_switcher/   # EN/ES toggle component
│   │   ├── menu/
│   │   │   ├── button_menu/     # Toolbar buttons (bold, italic, image, link, sections…)
│   │   │   │   ├── buttons_menu.tsx
│   │   │   │   ├── font_style_buttons.tsx
│   │   │   │   ├── image_input.tsx
│   │   │   │   ├── link_dialog.tsx
│   │   │   │   └── sections_selector.tsx
│   │   │   ├── desktop_menu.tsx
│   │   │   ├── mobile_menu.tsx
│   │   │   ├── preview_toggle/  # Toggle between edit and preview
│   │   │   └── summary_dialog/  # Dialog showing AI-generated summary
│   │   ├── preview/             # Article preview renderer
│   │   └── utils/               # Editor utility functions
│   ├── loaders/                 # Auto-save and loading spinners
│   └── playbook/                # Playbook form, hooks, types, utils
├── constants/                   # Static config and JSON locale files
│   ├── mainPage_data_text.json
│   ├── dasboardPage_data_text.json
│   ├── draft_article_text.json
│   ├── homePage_data_text.json
│   ├── playbook_form_data_text.json
│   ├── readPlaybook_data_text.json
│   ├── buttons_data_text.json
│   ├── categories.ts
│   ├── sections.ts
│   ├── colors.ts
│   └── icons.ts
├── lib/                         # Shared utilities (sanitisation, etc.)
├── middleware.ts                # Route protection + CSP headers + rate limiting
├── services/
│   ├── api/                     # Rate limiting helpers for route handlers
│   ├── authentication/          # next-auth configuration
│   └── db/                      # Firebase client + admin instances
│       ├── firebaseMain.js
│       ├── firebaseDecav.js
│       ├── firebase-admin.ts
│       └── firebase_admin_DeCav.ts
├── types/                       # Shared TypeScript types
└── utils/                       # nonce generator, misc helpers
```

---

## Pages

| Route           | Description                                       |
| --------------- | ------------------------------------------------- |
| `/`             | Login — email/password (Firebase) or Google OAuth |
| `/home`         | Landing page after login                          |
| `/dashboard`    | Main HTML article editor                          |
| `/playbook`     | Playbook/note creation form                       |
| `/readPlaybook` | Read saved playbook entries                       |

Protected routes (`/dashboard`, `/playbook`, `/readPlaybook`) redirect unauthenticated users to `/` via `middleware.ts`.

---

## Dashboard Editor (`/dashboard`)

The core editing experience lives in `components/dashboard/dashboard_editor.tsx` and its surrounding components.

**Features:**

- `contentEditable` div-based rich HTML editing.
- Toolbar actions: bold, italic, heading levels, ordered/unordered lists, strikethrough, inline code, links, images.
- **Image upload** — file selected via `image_input.tsx`, uploaded to IndexDB and later to Cloudinary, inserted inline.
- **Link dialog** — `link_dialog.tsx` prompts for URL and inserts an `<a>` tag.
- **Section selector** — `sections_selector.tsx` lets the user categorise the article before publishing.
- **Language switcher** — toggles UI language between `"en"` and `"es"`; all labels come from JSON locale files in `src/constants/`.
- **Translation** — calls `POST /api/translate` (which proxies to the Python API) to translate the full article (title + body) to the other language. HTML structure is preserved.
- **Summary generation** — calls `POST /api/summary` to get an AI-generated description via the Python `/resume` endpoint. Result shown in `summary_dialog/`.
- **Autosave** — article content is persisted to `localStorage` on every change; the key pattern is `draft-articleContent-<draftKey>`.
- **Draft loader** — `draft_article/` component lists saved drafts and loads them back into the editor.
- **Preview mode** — `preview/` renders the composed HTML before publishing; toggled via `preview_toggle/`.
- **Publish** — sends the final article to the Django CMS backend via `POST /api/post`.

---

## Auth Flow

1. User submits credentials or clicks "Sign in with Google" on `/`.
2. `next-auth` (`services/authentication/`) handles the session and issues a JWT.
3. `middleware.ts` checks the JWT on every request to protected routes.
4. For calls to the Python API, a Google ID token is retrieved and sent as `Authorization: Bearer <token>`.

Rate limiting is enforced on the route handlers `/api/post`, `/api/save`, `/api/translate`, `/api/summary`, etc. via `services/api/`.

---

## Storage Conventions

| Store            | Key                               | Purpose                                                                      |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| `localStorage`   | `draft-articleContent-<draftKey>` | Persisted article drafts between sessions                                    |
| `sessionStorage` | `playbook-item`                   | In-progress playbook form data; restored when user returns via `?modal=true` |

---

## Locale / i18n

All user-visible strings are stored in JSON files under `src/constants/`. The `language` state (`"en" | "es"`) in the dashboard drives which key set is rendered. To add or change copy:

1. Find the relevant JSON file (e.g. `dasboardPage_data_text.json`).
2. Add/edit both the `en` and `es` values.
3. Reference the key in the component via the imported JSON object.

---

## Adding a New Toolbar Button

1. Create the button component in `src/components/dashboard/menu/button_menu/`.
2. Register it in `buttons_menu.tsx`.
3. Implement the editing logic (using `document.execCommand` or Range API) in the appropriate hook or util file under `components/dashboard/`.

---

## Adding a New API Route

1. Create a folder under `src/app/api/<route-name>/` with a `route.ts` file.
2. Apply rate limiting via `services/api/` helpers.
3. Forward authenticated calls (attach Google ID token in `Authorization` header) to the appropriate downstream service.

---

## Development

```bash
pnpm install
pnpm dev          # starts next dev on port 3000
```

Or via Docker (from the project root):

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Production build

```bash
pnpm build
pnpm start        # runs on port 8000
```

---

## Security Notes

- All HTML content is sanitised with `dompurify` / `sanitize-html` before rendering or sending to the API.
- `middleware.ts` sets strict **Content-Security-Policy** headers (including a per-request nonce for inline scripts) on every response.
- Firebase credentials and API secrets must be provided via environment variables (`.env.local`); never commit them.

---

## Code Editing Rules

- When editing code, follow the Code Editing Instructions in `.github/instructions/code-editing.instructions.md`. and the Code Editing Skill in `.github/skills/codeEditing/SKILL.md`.
