# FloodWatch Guwahati

A mobile-first **demo/prototype** web app for reporting flooding and waterlogging
on Guwahati's smaller roads, bylanes and remote areas during monsoon season.

> **Disclaimer:** This prototype uses sample data and is not an official
> emergency warning system. Flood points shown in the app are demo markers,
> not live flood locations. For emergencies, contact the appropriate local
> emergency services.

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS
- Lucide React icons
- React Router
- Leaflet + React-Leaflet (OpenStreetMap tiles)
- `localStorage` for demo persistence (no backend)

## Features

**Citizen**

- Home dashboard with monsoon watch card, live stats and nearby reports
- Flood map with severity/status filters and DEMO DATA labeling
- 7-step one-page flood report form (location pin, severity, depth, road
  status, photo, description) with friendly validation
- Report success screen with generated report ID
- Alerts page and demo profile with "My Reports"

**Admin** (`/admin`, linked from Profile → "Open Admin Dashboard", no password)

- Dashboard statistics, full map, recent reports table
- Report list with working search, severity/status filters and sorting
- Report detail page with the status state machine:
  `PENDING → VERIFIED → IN PROGRESS → RESOLVED`, with `REJECTED` from
  pending/verified. Changes persist to `localStorage` immediately.

## Deployment (Cloudflare Pages)

The app is live at **https://floodwatch-guwahati-27j.pages.dev/**

To redeploy after changes:

```bash
npm run build
npm run deploy
```

Notes:
- `public/_redirects` provides the SPA fallback so deep links like
  `/admin/reports` work on Pages.
- First-time setup on a new machine: `npx wrangler login` (OAuth browser flow).

## Notes

- Severity levels (Low / Moderate / Severe / Critical) are **demo
  classifications**, not official government standards.
- All data is stored locally in your browser under the `floodReports` key.
  Use Profile → "Reset Demo Data" to restore the original sample reports.
