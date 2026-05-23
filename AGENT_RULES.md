# AGENT_RULES.md — Generalized Codebase & Agent Workflow Rules
**Author:** Devansh  
**Version:** 1.0 | **Last Updated:** 2026-05-23  
> This is the canonical reference for all AI agents working in this codebase.  
> **Read this file completely before writing, modifying, or deleting anything.**

---

## SECTION 0 — AGENT PRIME DIRECTIVES

These override everything else. No exceptions.

1. **Read before you write.** Before touching any file, read it fully. Never assume what it contains.
2. **One concern per response.** Do one thing completely and correctly. Do not bundle unrelated changes.
3. **Never hallucinate paths.** If a file or folder doesn't exist yet, say so. Don't invent imports or references.
4. **Minimal footprint.** Write only the code needed to satisfy the requirement. No speculative additions, no "while I'm at it" changes.
5. **Confirm before deleting.** Never delete a file without explicitly confirming with the user.
6. **Preserve working code.** If something works, don't refactor it unless asked. Stability > cleverness.
7. **Log every file you touch.** Every create / modify / delete → one line in `docs/CHANGELOG.md`. No exceptions.

---

## SECTION 1 — UNIVERSAL PROJECT STRUCTURE

Every project using these rules follows this top-level layout:

```
<project-root>/
├── AGENT_RULES.md              ← This file (read first, always)
├── PROJECT_RULES.md            ← Project-specific extensions (physics, game logic, etc.)
├── README.md                   ← Human-readable project intro
├── .gitignore
│
├── docs/                       ← Project-level documentation only
│   ├── CHANGELOG.md            ← File-level change log (every file touched)
│   ├── ERROR_LOG.md            ← Bugs, deviations, and resolutions
│   ├── DECISIONS.md            ← Architecture decisions with rationale
│   ├── HIGH_LEVEL_DESIGN.md    ← System architecture overview
│   └── PRD.md                  ← Product requirements
│
├── backend/                    ← Server-side code (if applicable)
├── frontend/                   ← Client-side code (if applicable)
└── tests/                      ← All test artifacts
    └── runs/                   ← Dated test run folders (see Section 4)
```

**Rules:**
- `docs/` contains only project-level plans and logs. No test results, no scratch notes.
- Never create nested `.vscode/` folders. One at workspace root only.
- `node_modules/`, `.venv/`, build outputs → always in `.gitignore`, never committed.

---

## SECTION 2 — CHANGELOG RULE (MANDATORY)

**File:** `docs/CHANGELOG.md`

Every file the agent creates, modifies, or deletes must be logged immediately — not at the end of a session.

```
Format:
[YYYY-MM-DD HH:MM] | <context/branch> | <action> | <filepath>

Actions: created | modified | deleted

Examples:
[2026-05-23 14:00] | feat/auth       | created  | backend/routes/auth.js
[2026-05-23 14:05] | feat/auth       | modified | backend/server.js
[2026-05-23 14:10] | feat/auth       | deleted  | backend/routes/old_auth.js
```

- One line per file per change.
- Log the action at the time it happens — never retroactively.
- Do NOT log: lint warnings, auto-formatter runs, node_modules, .venv contents.

---

## SECTION 3 — FILE & NAMING CONVENTIONS

### 3.1 Universal Naming

| Item | Convention | Example |
|---|---|---|
| Python files | `snake_case.py` | `quantum_channel.py` |
| React / RN components | `PascalCase.jsx` | `TaskCard.jsx` |
| JS/TS utilities | `camelCase.js` | `apiClient.js` |
| CSS modules | `PascalCase.module.css` | `TaskCard.module.css` |
| Constants files | `UPPER_SNAKE.js` or `constants.js` | `constants.js` |
| Docs files | `UPPER_SNAKE.md` | `HIGH_LEVEL_DESIGN.md` |
| Test files (Python) | `test_<module>.py` | `test_auth.py` |
| Test files (JS) | `<module>.test.js` | `TaskCard.test.js` |
| Test run folders | `YYYY-MM-DD_<kebab-name>` | `2026-05-23_auth-flow` |
| Log timestamps | `[YYYY-MM-DD HH:MM]` | `[2026-05-23 14:00]` |
| Env files | `.env`, `.env.example` | `.env.example` committed, `.env` gitignored |

### 3.2 Component Organization Rules

**React / React Native:**
```
src/
├── api/            ← All HTTP calls, one file per domain (no fetch() scattered in components)
├── store/          ← Global state only (Zustand / Redux). No local state duplication here.
├── hooks/          ← Custom hooks. One concern per hook.
├── screens/        ← (React Native) Full screens. Screens orchestrate, they don't fetch.
├── pages/          ← (React web) Same rule as screens.
├── components/     ← Reusable UI. Stateless where possible.
│   └── <domain>/   ← Group by domain, not by type (e.g., auth/, tasks/, ui/)
├── utils/          ← Pure functions. No side effects, no imports from store.
└── constants/      ← App-wide constants and config values.
```

**Python backend:**
```
backend/
├── main.py         ← Entry point only. No business logic here.
├── routes/         ← Route handlers. Thin: validate input, call service, return response.
├── services/       ← Business logic. No direct DB calls here — call models/repositories.
├── models/         ← DB schemas / Pydantic models.
├── middleware/     ← Auth guards, error handlers, logging.
├── utils/          ← Pure helper functions.
└── constants.py    ← All constants. Never hardcode values in logic files.
```

### 3.3 The Thin Layer Rule

Each layer does exactly one job:

| Layer | Allowed | Not Allowed |
|---|---|---|
| Route / Screen | Receive input, call service/hook, return output | Business logic, DB calls, fetch() |
| Service / Hook | Orchestrate logic | Direct DB access, UI state |
| Model / Store | Shape data | Logic, side effects |
| Component | Render | Fetch, compute, store |
| Util | Pure transform | Imports from store, side effects |

---

## SECTION 4 — TEST RUN ORGANIZATION

Every test run gets a dated folder. Never dump test files in the project root or docs.

```
tests/runs/YYYY-MM-DD_<name>/
├── README.md           ← What was tested and how to re-run
├── RESULTS.md          ← Actual numeric / pass-fail results
├── FINDINGS.md         ← Analysis, deviations, recommendations
├── suite/              ← Test scripts for this run
│   └── test_*.py / *.test.js
└── specs/              ← Test plan (bundled with results)
    ├── requirements.md
    └── tasks.md
```

Log every completed run as a one-liner in `docs/TEST_LOG.md`:
```
[YYYY-MM-DD] | <run-folder-name> | <N> tests | <N PASS / N FAIL> | <short note>
```

---

## SECTION 5 — ERROR LOG RULE

**File:** `docs/ERROR_LOG.md`

Log any bug that caused incorrect behavior, a broken build, or a data integrity issue.

```
[YYYY-MM-DD HH:MM] | <context> | ERROR: <short description>
Cause:      <root cause — be specific>
Resolution: <exactly what was changed to fix it>
Prevention: <rule or check to prevent recurrence>
```

Do NOT log: lint warnings, missing semicolons, cosmetic issues.  
Always log: wrong output, broken routes, state corruption, security holes.

---

## SECTION 6 — STATE MANAGEMENT RULES

Applies to all frontend projects.

- **Single source of truth.** One store, one owner per piece of state. Never duplicate state between a store and a component's `useState`.
- **Derived state is not state.** If a value can be computed from existing state, compute it — don't store it.
- **No fetch in components.** All API calls live in `api/` or custom hooks. Components receive data, they don't fetch it.
- **Optimistic updates with rollback.** When a mutation is likely to succeed, update the UI immediately. Roll back on error.
- **Hydrate from AsyncStorage on app start** (React Native). Never assume fresh state.

---

## SECTION 7 — API CONTRACT RULES

- All API base URLs go in `.env`. Never hardcode `localhost:8000` in component files.
- Every endpoint must have a corresponding schema/type definition (Pydantic / TypeScript interface).
- HTTP status codes must be used correctly:
  - `200` — success with data
  - `201` — resource created
  - `400` — client error (bad input)
  - `401` — unauthenticated
  - `403` — unauthorized (authenticated but no permission)
  - `404` — not found
  - `500` — server error (never expose stack traces to client)
- All endpoints return consistent envelope format:
  ```json
  { "data": ..., "error": null }
  { "data": null, "error": "message" }
  ```
- Auth-protected routes must be guarded at the route level — never trust client-side-only checks.

---

## SECTION 8 — SECURITY BASELINE

- **Never commit secrets.** API keys, DB connection strings, JWT secrets → `.env` only. Provide `.env.example` with placeholder values.
- **Hash passwords** with bcrypt (cost factor ≥ 10). Never store plaintext or MD5/SHA1.
- **JWT expiry** must be set. Default: access token 15m, refresh token 7d.
- **Validate all inputs** at the API layer before they touch the DB. Use Pydantic (Python) or Zod / Joi (JS).
- **CORS** must be explicitly configured — never wildcard `*` in production.

---

## SECTION 9 — DEPENDENCY RULES

- **Pin versions** in production. Use `requirements.lock` (Python) or `package-lock.json` / `yarn.lock` (Node).
- **One package per job.** Don't install two libraries that do the same thing (e.g., both `axios` and `node-fetch`).
- **Check bundle impact** before adding a frontend dependency. Large libraries need justification.
- **No unused dependencies.** If a package is no longer used, remove it and log the deletion.

---

## SECTION 10 — GIT & BRANCH RULES

- **Branch names:** `feat/<name>`, `fix/<name>`, `refactor/<name>`, `docs/<name>`
- **Commit message format:**
  ```
  <type>(<scope>): <short description>

  Types: feat | fix | refactor | docs | test | chore
  Example: feat(auth): add JWT middleware to task routes
  ```
- **Never commit directly to main.** All changes via branches + merge.
- **One logical change per commit.** Don't bundle a feature and a bug fix in the same commit.
- **Delete branches after merge.**

---

## SECTION 11 — AGENT WORKFLOW PROTOCOL

This is the recommended session structure when working with any AI coding agent.

### Before starting a session
```
1. State the single goal of this session in one sentence.
2. List the files the agent will likely need to read.
3. State the exit condition: "This session is done when X works / Y passes."
```

### During a session
```
1. Agent reads relevant files first — never writes blind.
2. Agent proposes a plan before writing code (for anything > 1 file).
3. Changes happen in this order: models → services → routes → components → tests.
4. After each file is written, agent logs it to CHANGELOG.md.
5. Agent does NOT refactor unrelated code it happens to notice.
```

### After a session
```
1. Verify the exit condition is met.
2. If a bug was found and fixed, add it to ERROR_LOG.md.
3. If tests were run, add a one-liner to TEST_LOG.md.
4. Commit with a proper message.
```

### When switching models mid-project
```
The new model MUST read these files before writing anything:
  - AGENT_RULES.md          (this file)
  - PROJECT_RULES.md        (domain-specific rules)
  - docs/HIGH_LEVEL_DESIGN.md
  - docs/DECISIONS.md
  - docs/CHANGELOG.md       (last 20 entries minimum)

Only after reading these is the model allowed to write code.
This is what prevents context drift between model switches.
```

---

## SECTION 12 — DECISIONS LOG RULE

**File:** `docs/DECISIONS.md`

Every significant architecture or technology choice must be recorded here.

```
## [YYYY-MM-DD] — <Decision title>

**Decision:** What was chosen.
**Alternatives considered:** What else was evaluated.
**Rationale:** Why this choice was made.
**Trade-offs:** What you give up.
**Revisit when:** Condition under which this decision should be reconsidered.
```

Examples of decisions worth logging: choice of state library, DB type, auth strategy, folder structure changes, major dependency additions.

---
