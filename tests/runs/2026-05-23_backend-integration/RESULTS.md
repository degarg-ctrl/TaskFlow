# Test Results — 2026-05-23

This file tracks the pass/fail results of the API integration suite.

## Summary
* **Total Tests**: 11 assertions
* **Status**: Pending execution.
* **Database Target**: Remote MongoDB Atlas / Local MongoDB instance.

## Assertions Checklist
* [ ] POST /auth/register returns 201 Status
* [ ] POST /auth/register returns valid token payload
* [ ] POST /auth/register returns correct email payload
* [ ] POST /auth/login returns 200 Status
* [ ] POST /auth/login returns valid token payload
* [ ] GET /tasks without token returns 401 status
* [ ] GET /tasks without token returns structured error envelope
* [ ] POST /tasks with token returns 201 status
* [ ] POST /tasks stores correct parameters
* [ ] GET /tasks returns 200 status
* [ ] GET /tasks yields task array payload
* [ ] GET /tasks list contains newly created task
* [ ] PUT /tasks/:id returns 200 status
* [ ] PUT /tasks/:id status update persists
* [ ] PUT /tasks/:id priority update persists
* [ ] DELETE /tasks/:id returns 200 status
* [ ] Task is permanently deleted
