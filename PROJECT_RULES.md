# PROJECT_RULES.md — Task Manager with Auth

**Project:** TaskFlow — MERN Task Manager  
**Type:** React Native (Expo) + Node.js/Express + MongoDB  
**Version:** 1.0 | **Last Updated:** 2026-05-23  
**Extends:** AGENT_RULES.md (must be loaded alongside this file)

> This file contains ONLY rules specific to TaskFlow.  
> Do not duplicate anything already in AGENT_RULES.md.  
> The agent must follow both files simultaneously.

---

## 1. PROJECT OVERVIEW

**What it is:** A mobile task manager with per-user JWT authentication and priority-based task organization.  
**Who uses it:** Single user per account — personal productivity app.  
**Core problem it solves:** Demonstrate full MERN stack proficiency with auth, protected routes, and global state management for an internship portfolio.

---

## 2. TECH STACK

|Layer|Technology|Version|Notes|
|-|-|-|-|
|Mobile frontend|React Native (Expo managed)|SDK 54|No bare workflow|
|Backend|Node.js + Express|18.x / 4.x|REST only, no GraphQL|
|Database|MongoDB Atlas|Free tier|Via Mongoose ODM|
|State management|Zustand|^4.x|Two stores: auth + tasks|
|Navigation|React Navigation|v6|Bottom tabs + stack|
|Auth|JWT + bcryptjs|—|Access token only (no refresh token for now)|
|HTTP client|Axios|^1.x|Central instance in `api/client.js`|
|Token storage|AsyncStorage|1.x|JWT persisted here|
|Icons|@expo/vector-icons (Feather)|^14|No other icon sets|

**Hard constraints:**

* No class components. Hooks only.
* No inline styles. `StyleSheet.create()` only.
* No `fetch()` in components or screens. All HTTP goes through `api/client.js`.
* No Redux, Context API for global state. Zustand only.
* No additional libraries without explicit user approval.
* Expo managed workflow — do NOT eject or use bare workflow modules.

---

## 3. PROJECT STRUCTURE

```
taskflow/
├── PROJECT_RULES.md          ← This file
├── AGENT_RULES.md            ← Global rules (loaded alongside this)
├── app.json
├── App.js                    ← Entry point, renders AppNavigator only
├── babel.config.js
├── package.json
│
├── backend/                  ← Express API
│   ├── server.js             ← App entry, middleware registration, server start
│   ├── .env                  ← MONGO_URI, JWT_SECRET, PORT (never commit)
│   ├── .env.example          ← Committed placeholder
│   ├── package.json
│   ├── models/
│   │   ├── User.js           ← name, email, passwordHash, timestamps
│   │   └── Task.js           ← title, note, priority, dueDate, status, userId, timestamps
│   ├── routes/
│   │   ├── auth.js           ← POST /api/auth/register, POST /api/auth/login
│   │   └── tasks.js          ← GET/POST/PUT/DELETE /api/tasks (all protected)
│   ├── middleware/
│   │   └── authGuard.js      ← JWT verify — attaches req.userId
│   └── utils/
│       └── generateToken.js  ← jwt.sign() wrapper
│
└── src/
    ├── api/
    │   └── client.js         ← Axios instance, base URL from env, token header injection
    ├── store/
    │   ├── authStore.js      ← { user, token, login(), logout() } — persists token to AsyncStorage
    │   └── taskStore.js      ← { tasks, fetchTasks(), addTask(), updateTask(), deleteTask() }
    ├── hooks/
    │   └── useProtectedRoute.js  ← Redirects to Login if no token in authStore
    ├── navigation/
    │   └── AppNavigator.js   ← Auth stack (Login/Register) + Tab navigator (Tasks/Profile)
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── TasksScreen.js    ← Main list with filter bar
    │   ├── AddTaskScreen.js  ← Form: title, note, priority, due date
    │   └── ProfileScreen.js  ← Shows user info + logout button
    └── components/
        ├── TaskCard.js       ← Displays one task, bookmark/delete actions
        ├── FilterBar.js      ← All / Active / Done tab pills
        └── PriorityBadge.js  ← Low (green) / Medium (amber) / High (red) pill

```

**Placement rules:**

* Business logic → `store/` actions or `backend/routes/`. Never in screens or components.
* A screen's job: render + call store actions. Nothing else.
* `api/client.js` is the ONLY file that imports axios and makes HTTP calls.
* Environment variables → `backend/.env`. Frontend env → `app.json` extra or a `.env` at root with Expo constants.

---

## 4. DOMAIN RULES

### 4.1 Authentication Rules

* Passwords must be hashed with `bcryptjs` at salt rounds ≥ 10. Never store plaintext.
* JWT secret comes from `process.env.JWT_SECRET`. Never hardcode it.
* Token expiry: `7d` for this project (no refresh token needed at this scope).
* On login/register success, token is stored in AsyncStorage via `authStore.login()`.
* On logout, AsyncStorage is cleared and task store is reset.
* Every task route must pass through `authGuard.js`. No exceptions.
* `req.userId` (set by authGuard) is the ONLY source of userId when querying tasks. Never trust client-sent userId.

### 4.2 Task Rules

* Valid priorities: `'low'`, `'medium'`, `'high'`. No other values accepted.
* Valid statuses: `'active'`, `'done'`. No other values accepted.
* `dueDate` is optional. If provided, store as ISO string.
* Tasks are always filtered by `userId` on the backend — users can never see each other's tasks.
* Deleting a task is permanent. No soft delete needed.

### 4.3 State Rules

* `authStore` owns: `user` object, `token` string, `isAuthenticated` boolean.
* `taskStore` owns: `tasks` array, `loading` boolean, `error` string or null.
* Derived values (e.g. filtered tasks by status) are computed inside the component with `useMemo`, not stored.
* `taskStore` must be reset (cleared) when the user logs out.

---

## 5. FEATURE SCOPE

### In scope (build these)

* [ ] User registration with name, email, password
* [ ] User login with JWT, token persisted to AsyncStorage
* [ ] Protected task routes (authGuard on all task endpoints)
* [ ] Create task: title (required), note (optional), priority, due date (optional)
* [ ] List tasks with filter: All / Active / Done
* [ ] Mark task as done / active (toggle)
* [ ] Delete task
* [ ] Logout (clear token + tasks)
* [ ] Auto-redirect to Login if no token on app start
* [ ] Priority badge on TaskCard (color-coded)

### Out of scope (do NOT build)

* Refresh tokens or token rotation
* Search / full-text filtering (filter by status only)
* Task categories or tags
* Push notifications
* Social login (Google, GitHub)
* Admin panel or multi-user management
* Animations beyond basic opacity/fade
* Pagination (load all tasks, ≤ 100 per user is fine)

---

## 6. ENVIRONMENT & SETUP

```bash
# Backend
cd backend
npm install
# Create .env from .env.example, fill in values
node server.js   # or: npx nodemon server.js

# Frontend
npm install
npx expo start
```

**Backend `.env` variables:**

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskflow
JWT_SECRET=replace_with_long_random_string
PORT=5000
```

**Frontend base URL:**  
Set `API_BASE_URL` in `src/api/client.js`. Use your machine's local IP (not localhost) when testing on a physical device via Expo Go.

---

## 7. KNOWN DECISIONS

|Decision|Choice|Reason|
|-|-|-|
|State library|Zustand|Simpler than Redux, no boilerplate, easy to reset on logout|
|Auth token storage|AsyncStorage|Only mobile-safe option in Expo managed workflow|
|Token strategy|Access token only (7d expiry)|Refresh tokens add complexity not needed for a portfolio project|
|API client|Single Axios instance in `client.js`|Centralizes auth header injection — no scattered fetch() calls|
|Styling|StyleSheet.create() only|Consistent with React Native best practices, no inline style drift|
|Icon set|Feather (via @expo/vector-icons)|Already installed from Pulse project, consistent look|
|No soft delete|Hard delete only|Simpler schema, no need for archive/restore at this scope|

---

## 8. CURRENT SESSION GOAL

**Active goal:** Build the Express backend — server.js, User model, Task model, auth routes (register + login), and authGuard middleware.  
**Exit condition:** `POST /api/auth/register` and `POST /api/auth/login` both return valid JWTs when tested via Postman or curl.  
**Files expected to change:**

* `backend/server.js` (create)
* `backend/models/User.js` (create)
* `backend/models/Task.js` (create)
* `backend/routes/auth.js` (create)
* `backend/middleware/authGuard.js` (create)
* `backend/utils/generateToken.js` (create)
* `backend/.env.example` (create)
* `backend/package.json` (create)
* `docs/CHANGELOG.md` (update after each file)

---

## EXTENSION NOTES

<!--
  After each session, update Section 8 with the next goal.
  After each decision, add it to Section 7.
  Keep Section 5 checkboxes current as features are completed.
  Do NOT touch AGENT_RULES.md.
-->
