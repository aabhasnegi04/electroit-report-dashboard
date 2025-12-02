Backend (Express + MSSQL) - Electronic Store Dashboard

Environment variables (create a file named .env in this folder using the keys below):

PORT=4000

# Electronic Store database
ELECTRONIC_STORE_SERVER=160.187.80.75
ELECTRONIC_STORE_PORT=15347
ELECTRONIC_STORE_USER=sa
ELECTRONIC_STORE_PASSWORD=vmhoster#678
ELECTRONIC_STORE_DATABASE=UD_NICE

Scripts:
- npm run start – starts the API on PORT

Endpoints:
- GET /health – health check
- GET /api/store – get electronic store info
- POST /api/exec – body: { procedure: "sp_name", params: { key: value } }
- POST /api/query – body: { query: "SELECT * FROM table", params: { key: value } }
- GET /api/dashboard – Returns dashboard data from electronic store database

Example requests:

```json
POST /api/exec
{
  "procedure": "proc_SalesSummary",
  "params": {
    "StartDate": "2025-01-01",
    "EndDate": "2025-01-31"
  }
}
```

```json
POST /api/query
{
  "query": "SELECT * FROM Products WHERE Category = @Category",
  "params": {
    "Category": "Electronics"
  }
}
```


