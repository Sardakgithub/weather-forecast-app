# Deployment guide — Render + MongoDB Atlas

This project is configured for deployment to Render using the included `render.yaml` at the repository root. Follow the steps below to deploy the API and client.

Prerequisites
- A GitHub repository with this project (already present).
- A Render account with GitHub connected: https://dashboard.render.com
- A MongoDB instance (Atlas recommended) and the connection string (`MONGODB_URI`).

Quick overview
- `render.yaml` defines two services:
  - `weather-api` (web, rootDir: `server`) — uses `npm install` and `npm run start`.
  - `weather-client` (static, rootDir: `client`) — uses `npm install && npm run build`, publishes `dist`.
- `VITE_API_BASE` is automatically wired from the API service URL to the client service.
- `ALLOWED_ORIGINS` is also wired from the static service URL to the API service.

Steps — Render
1. Go to Render → New → "Import from GitHub" → select the repository.
2. Choose "Use Render YAML" so Render uses the included `render.yaml` to create services.
3. After the services are created, edit the `weather-api` service settings:
   - Under Environment → Environment Variables, add `MONGODB_URI` with your Atlas connection string.
   - If you want a custom `PORT`, add it (Render normally provides one).
4. (Optional) Add any other secrets or overrides under the service environment variables.
5. Trigger a manual deploy from Render or let it deploy automatically from the default branch.

Notes about env wiring
- `render.yaml` contains:
  - For the API service: `envVars: - key: MONGODB_URI` (you must supply this value in Render)
  - For the client service: `envVars: - key: VITE_API_BASE` that comes from the API service URL
  - For the API service: `ALLOWED_ORIGINS` is set from the client URL in `render.yaml` so CORS will allow the client automatically.

Local testing
- Server
  1. Create `server/.env` (copy `server/.env.example`) and fill in `MONGODB_URI`.
  2. Run:
```powershell
cd server
npm install
npm run dev
```

- Client
  1. Create `client/.env` (copy `client/.env.example`) and adjust `VITE_API_BASE` if needed.
  2. Run:
```powershell
cd client
npm install
npm run dev
```

Verification
- API health: `https://<your-api-url>/api/health` should return `{ "status": "ok" }`.
- Client: visit the static site URL Render provides and confirm the UI loads and requests to the API succeed.

If you want, I can also:
- Add a small Health-check script or smoke-test file to run after deployment.
- Create a Git commit message and show the `git` commands to push the new files.
