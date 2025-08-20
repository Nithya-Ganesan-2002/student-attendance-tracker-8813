# Attendance Frontend App

Modern, minimalistic React app for the Attendance Management Application. It provides role-based dashboards for admin, teacher, and student users, integrates Supabase authentication, and communicates with the backend FastAPI service.

## Features
- Role-based dashboards (admin, teacher, student)
- Supabase authentication (email/password)
- Attendance marking and tracking (teacher)
- Class and user management (admin)
- Reports with CSV/PDF export (admin, teacher)
- Pop-up notifications
- Responsive layout with sidebar navigation and top bar
- Theme toggle (light/dark)

## Environment Variables
Create a `.env` file based on `.env.example` and set:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_API_BASE_URL`
- `REACT_APP_SITE_URL`

These are used in `src/config.js` and `src/lib/supabaseClient.js`.

## Development
- `npm install`
- `npm start` (opens http://localhost:3000)

## Code Structure
- `src/App.js` – Router and route guards
- `src/AppShell.js` – Sidebar, top bar, notifications, layout
- `src/pages/*` – Feature pages and dashboards
- `src/services/api.js` – REST API wrapper using Supabase bearer token
- `src/lib/supabaseClient.js` – Supabase client and auth helpers
- `src/utils/export.js` – CSV/PDF export utilities
- `src/App.css` – Minimalistic, responsive styles with specified colors

## Notes
- Backend endpoints are expected at `REACT_APP_API_BASE_URL` and must implement authentication via Supabase JWT (Authorization: Bearer).
- PDF export uses a simple print-window method as a client fallback; for production PDFs, prefer server-generated files.

