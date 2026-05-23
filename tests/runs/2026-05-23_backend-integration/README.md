# API Integration Test Run — 2026-05-23

This run verifies the Express backend authentication and task CRUD APIs.

## Prerequisites
1. Ensure the Express server is running on `http://localhost:5000`.
2. The server must be connected to a valid MongoDB instance (e.g. MongoDB Atlas configured in `backend/.env`).

## Running the Test Suite
From the root of this test run directory, run the node test script:
```bash
node suite/test_api.js
```
