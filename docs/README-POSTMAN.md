RTI Management API — Postman Import

Instructions

- Import the collection: `docs/RTI-API-Postman-Collection.json` into Postman (File > Import).
- Import the environment: `docs/RTI-API-Environment.json` and select it in the top-right environment selector.
- Ensure your backend is running (from `server/`):

```bash
# from project root
cd server
npm install
npm run dev
```

- Default server URL: `http://localhost:4000` (set via `base_url` environment variable in Postman).
- To test endpoints:
  - `Get RTI list`: GET `{{base_url}}/api/rti`
  - `Get RTI by ID`: set `rti_id` in environment then GET `{{base_url}}/api/rti/{{rti_id}}`
  - `Create RTI (Submit)`: POST `{{base_url}}/api/rti` with sample JSON body (see collection)
  - `Create RTI (Save Draft)`: POST `{{base_url}}/api/rti` with `status: "Draft"`
  - `Update RTI`: PUT `{{base_url}}/api/rti/{{rti_id}}`
  - `Delete RTI`: DELETE `{{base_url}}/api/rti/{{rti_id}}`

Notes

- Validation: The API enforces strict validation for non-draft submissions — the collection includes both a Submit and a Save Draft example. For Save Draft, fewer fields are required.
- Responses: list endpoint returns `{ data: [...], total, page, pageSize }`; single record returns a flattened object matching frontend expectations.

If you'd like, I can:
- Add example tests or pre-request scripts to populate `rti_id` automatically after a create request.
- Convert to a Postman Collection v2.0 or export a curl examples file.
