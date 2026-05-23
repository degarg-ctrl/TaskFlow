# High Level Design - TaskFlow

This document describes the design architecture, flows, and schema structures for the TaskFlow Task Manager.

## 1. System Architecture

TaskFlow uses a client-server architecture split into:
1. **Frontend Mobile Client**: React Native app built using Expo. Coordinates view states and offline persistence.
2. **Backend API Service**: Express.js REST APIs connected to MongoDB. Evaluates authorizations and records tasks data.

```mermaid
graph TD
    subgraph Frontend (React Native / Expo)
        A[React Screens] --> B[Zustand Stores]
        B --> C[Axios API Client]
        B --> D[AsyncStorage]
    end
    subgraph Backend (Node / Express)
        C -->|HTTP / JWT| E[Express App]
        E --> F[Auth Guard Middleware]
        F --> G[Routes]
        G --> H[Mongoose Models]
    end
    subgraph Database
        H --> I[(MongoDB Atlas)]
    end
```

## 2. Component Layout

### Navigation Architecture
* **AppNavigator** (Root Navigation Container)
  * **Auth Stack (for unauthenticated state)**
    * `LoginScreen`
    * `RegisterScreen`
  * **App Tabs (for authenticated state)**
    * `TasksScreen` (Lists, FilterBar, and AddTask redirection)
    * `ProfileScreen` (User settings, active session details, and Logout)

### Stores & State Flows
* **authStore**: Tracks `token`, `user`, `isAuthenticated`, `loading`.
* **taskStore**: Syncs task lists from API client and tracks query statuses.
* **Axios Interceptor**: Intercepts outgoing client requests and automatically injects JWT header if a token exists in `authStore`.

## 3. Data Models Schema

### User Schema (MongoDB)
* `name`: String (Required)
* `email`: String (Required, Unique, Lowercase)
* `passwordHash`: String (Required, bcryptjs-hashed)
* `createdAt` & `updatedAt`: Timestamps

### Task Schema (MongoDB)
* `title`: String (Required)
* `note`: String (Optional)
* `priority`: String (Required: `'low' | 'medium' | 'high'`)
* `dueDate`: Date (Optional)
* `status`: String (Required: `'active' | 'done'`, defaults to `'active'`)
* `userId`: ObjectId (Required, links to User model)
* `createdAt` & `updatedAt`: Timestamps
