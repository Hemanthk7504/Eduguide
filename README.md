# EduGuide AI — Frontend

React 18 + TypeScript + Vite frontend for the EduGuide AI college admission counseling platform.

## Stack
- React 18, TypeScript, Vite
- Tailwind CSS v4 (dark, indigo/violet theme)
- React Router v7
- TanStack Query (React Query) for API state/caching
- Axios with a bearer-token interceptor (redirects to `/login` on 401)
- Recharts for the admission-probability chart
- react-hook-form + zod for validated forms

## Setup

```bash
npm install
cp .env.example .env   # points at http://localhost:8000/api/v1 by default
npm run dev
```

The FastAPI backend must be running at the URL in `VITE_API_BASE_URL` (`.env`).

## Structure

```
src/
  api/          axios instance + one module per backend domain (auth, profiles, agents, misc)
  types/api.ts  TypeScript types mirroring every request/response in the API reference
  hooks/        useAuth (token + current user context)
  components/   AppShell (nav), AgentRail (pipeline visual), ChatPanel/ChatDrawer, cards, skeletons
  pages/        one file per route, plus pages/admin forms inside Admin.tsx
```

## Pages / routes
- `/login`, `/register` — auth
- `/onboarding` — 3-step profile form → create → validate → dashboard
- `/dashboard/:profileId` — profile summary, tiered college recs, probability chart, scholarships,
  branch guidance, career roadmap, PDF report button, floating chat launcher
- `/colleges` — searchable directory, click a card for cutoffs
- `/chat` — full-page chat (same panel also opens as a drawer from the dashboard)
- `/reports` — generated PDF reports, download button
- `/notifications` — unread/read list, mark-as-read
- `/admin` — colleges/cutoffs, scholarships, branches, knowledge-base ingestion (role === "admin" only)

## Notes
- Chat session IDs are generated with `uuid` and persisted in `localStorage` per profile
  (`eduguide_chat_session_<profileId>`), so history survives across visits.
- The dashboard calls only `GET /dashboard/{profile_id}` — the individual agent endpoints
  (`/colleges/recommendations/...`, `/scholarships/matches/...`, etc.) are wired up in `src/api/agents.ts`
  for the admin/debug views but aren't called from the main dashboard.
- `npm run build` has been verified to type-check and bundle cleanly.
