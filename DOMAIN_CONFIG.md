# Domain Configuration

## Production Domains
- **Frontend**: https://report.electroitzone.com
- **Backend**: https://adm.electroitzone.com

## Local Development
- **Frontend**: http://localhost:5173 (via Vite dev server)
- **Backend**: http://localhost:4000

## Configuration Details

### Backend (backend/src/index.js)
- CORS is configured to allow requests from:
  - `http://localhost:5173` (local development)
  - `https://report.electroitzone.com` (production frontend)

### Frontend (frontend/src/shared/ReportRunner.jsx)
- API calls automatically detect the current domain:
  - If running on `report.electroitzone.com` → uses `https://adm.electroitzone.com`
  - If running on `localhost` → uses local backend (via proxy)
  - If `VITE_API_BASE` is set → uses that URL

### Vite Configuration (frontend/vite.config.js)
- Local development: Proxy `/api` calls to `http://localhost:4000`
- Production builds: Uses domain-based auto-detection

## Deployment Notes
1. Frontend should be deployed to `report.electroitzone.com`
2. Backend should be deployed to `adm.electroitzone.com`
3. Both domains must have valid SSL certificates
4. CORS is properly configured for cross-origin requests
