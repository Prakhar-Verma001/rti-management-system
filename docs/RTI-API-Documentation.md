# RTI Management API Documentation

Generated: 2026-05-19

## Base URL

`{{base_url}}` (default: `http://localhost:4000`)

## Overview

This document describes the RTI Management backend API endpoints exposed under `/api/rti`.
Use the Postman collection at `docs/RTI-API-Postman-Collection.json` for runnable examples.

---

## Endpoints

### 1) GET /api/rti
- Purpose: List RTI applications with pagination and optional filters.
- Query parameters:
  - `page` (number, optional) — page number (default 1)
  - `pageSize` (number, optional) — items per page (default 10)
  - `search` (string, optional) — search by applicant name or RTI number
  - `startDate`, `endDate` (ISO date string) — dateOfReceipt range
  - `status` (string) — status filter (e.g., `Pending`, `Draft`)
  - `department` (string) — department name
- Response: `{ data: [...], total, page, pageSize }`

### 2) GET /api/rti/{id}
- Purpose: Retrieve a single RTI application by its MongoDB ObjectId.
- Path parameter: `id` (ObjectId)
- Response: flattened RTI application object (applicant, department (populated), rtiDetail fields, createdAt, updatedAt)

### 3) POST /api/rti
- Purpose: Create a new RTI application (submit or save draft).
- Body (application/json):
```
{
  "applicantName": "John Doe",
  "gender": "Male",
  "contactNumber": "1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "subject": "Request for records",
  "applicationMode": "Online",
  "dateOfReceipt": "2026-05-19",
  "description": "Please provide the requested documents.",
  "department": "Finance Department",
  "assignedOfficer": "Officer 1",
  "dueDate": "2026-06-01",
  "extendedDueDate": "",
  "reminderFrequency": "Monthly",
  "status": "Pending",
  "uploadApplication": "",
  "additionalAttachments": [],
  "rtiNo": ""
}
```
- Notes: When `status === "Draft"`, many validators are skipped and partial payloads are accepted. When creating and `department` provided, a `DepartmentDetail` record is created or reused.
- Response: `201 Created` with the created object (flattened).

### 4) PUT /api/rti/{id}
- Purpose: Update an existing RTI application.
- Path parameter: `id` (ObjectId)
- Body: same shape as POST. When department provided, the DepartmentDetail is found or created; otherwise existing department is preserved.
- Response: `200 OK` with updated object (flattened).

### 5) DELETE /api/rti/{id}
- Purpose: Delete an RTI application along with its associated `RtiDetail` record.
- Path parameter: `id` (ObjectId)
- Response: `204 No Content` on success.

---

## Validation and errors
- The API uses `express-validator` for request validation. For non-draft submissions the API returns `400` with payload: `{ message: "Validation failed", errors: [{ field, message }, ...] }`.
- Mongoose validation errors are returned by the global error handler with a similar shape for client mapping.

---

## Postman
- Collection: `docs/RTI-API-Postman-Collection.json` (import into Postman)
- Environment: `docs/RTI-API-Environment.json` (contains `base_url` and `rti_id` placeholder)

---

## Notes
- See `server/index.js` to run the server locally:

```bash
cd server
npm install
npm run dev
```

If you'd like, I can:
- Add Postman test scripts (e.g., capture created `rti_id` into the environment automatically).
- Produce a true binary `.docx` file and add it to `docs/` (requires generating a zipped Office package). Currently a Word-compatible XML (`RTI-API-Documentation.docx`) and Markdown are provided.
