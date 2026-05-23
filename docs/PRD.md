# Product Requirements Document (PRD) - TaskFlow

This document captures the requirements, user stories, features, and out-of-scope boundaries for the TaskFlow project.

## 1. Goal
TaskFlow serves as a simple mobile-first task organizer demonstrating secure user authentication, token storage, and client-side sorting/filtering operations on a MERN stack.

## 2. User Persona & Scenarios
* **Internship Portfolio Viewers**: Reviewing clean structure, protected routes, and responsive designs.
* **Individual Users**: Organizing tasks with title, description, priority rank, and status checkboxes.

## 3. Functional Requirements

### User Authentication
* **Registration**: Register with name, email, and password. Email must be unique. Password must be hashed before DB store.
* **Authentication**: Login returns a JWT. Token is stored locally in AsyncStorage and remains valid for 7 days.
* **Verification**: API routes require valid JWT tokens. Unauthenticated clients receive `401 Unauthorized`.
* **Redirection**: On app start, verify local token. If token is invalid/empty, redirect user to `LoginScreen`.

### Task CRUD Operations
* **Create Task**: Set title (required), note (optional), priority, and due date.
* **Read Tasks**: List all tasks related to the authenticated user. Never permit cross-user views.
* **Update Task**: Modify fields (title, note, priority, due date) or toggle status (`'active' | 'done'`).
* **Delete Task**: Permanently purge tasks from database.

### Filtering & Custom Ordering
* **FilterBar**: Choose tabs `All` / `Active` / `Done`.
* **Priority Badge**: Display color indicator based on priorities (`'low'` / `'medium'` / `'high'`).
* **Sorting**: Sort list dynamically (e.g. by status, priority, or date) without requiring database recalculations.

## 4. Boundaries & Constraints
* **Scope Limits**:
  * Access-token only auth (no refresh tokens or rotation).
  * No push notifications.
  * No tags, category separations, or sharing links.
  * No search functionality (filter by status tabs only).
