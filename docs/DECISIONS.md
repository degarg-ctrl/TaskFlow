# Decisions Log - TaskFlow

## [2026-05-23] — State Library Choice: Zustand

**Decision:** Adopt Zustand for global app state management.
**Alternatives considered:** Redux Toolkit, React Context API.
**Rationale:** Zustand is extremely lightweight, requires zero boilerplate, performs optimally with React Native, and has simple patterns for state resetting (crucial on user logout).
**Trade-offs:** Less ecosystem tooling/middleware support compared to Redux, but unnecessary at this scale.
**Revisit when:** App scope expands to include complex background actions, offline persistence sync queues, or multi-role administration dashboards.

---

## [2026-05-23] — Auth Token Strategy: Access Token Only

**Decision:** Set up single access token stored in AsyncStorage with 7-day expiration.
**Alternatives considered:** Access token + Refresh token pair, Cookie-based sessions.
**Rationale:** A portfolio-scale mobile app does not require token rotation or short access windows. AsyncStorage is the standard mechanism in Expo.
**Trade-offs:** If the token is intercepted, it remains valid for 7 days.
**Revisit when:** Integrating high-security transaction interfaces or multi-device sessions.

---

## [2026-05-23] — Style Definition: StyleSheet.create() Only

**Decision:** Enforce vanilla CSS styles using React Native's `StyleSheet.create()`. No inline styles or styling libraries.
**Alternatives considered:** Tailwind CSS / NativeWind.
**Rationale:** Native CSS stylesheets are highly performant in React Native, eliminate third-party dependency footprint, and align with pure stack conventions.
**Trade-offs:** More verbose styles structure.
**Revisit when:** Tailwind CSS or design token compilation is mandated by stakeholders.

---
