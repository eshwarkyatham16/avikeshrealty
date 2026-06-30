# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Avikesh Realty is a real-estate marketing site with a public-facing React SPA and an admin CMS, backed by an Express API. It is a monorepo with two workspaces: `client/` (Vite + React 19) and `server/` (Express). The root `package.json` orchestrates both.

## Commands

Run from the repo root:

- `npm run dev` — runs server and client concurrently (server on :5001, client on :3000)
- `npm run client` / `npm run server` — run either side alone
- `npm run build` — production build of the client
- `npm run seed` — seed `server/data/*.json` (skips files that already exist)
- `npm run install-all` — install deps in both workspaces

Client-only (from `client/`): `npm run dev`, `npm run build`, `npm run lint` (oxlint), `npm run preview`.

Server-only (from `server/`): `npm run dev` (uses `node --watch`), `npm run start`, `npm run seed:force` (overwrites existing data files — destructive).

There is no test suite. Lint is oxlint on the client only.

## Architecture

### Data storage — flat JSON files, not a database

Despite stray MongoDB packages in `node_modules`, the server has **no database**. All persistence is JSON files in `server/data/` (`properties.json`, `testimonials.json`, `team.json`, `settings.json`, `admin.json`), read/written through `server/src/utils/fileStore.js` (`readJSON`/`writeJSON`). Each route module loads the whole array, mutates it in memory, and writes the whole file back. IDs are `randomUUID()` stored as `_id`; properties also get a unique `slug` via `server/src/utils/slugify.js`. There is no concurrency control — concurrent writes can clobber each other.

`server/data/` is created/populated by the seed script. Run `npm run seed` before first use.

### API layer

`server/src/index.js` mounts routers under `/api/{properties,testimonials,team,auth,settings,dashboard}` and serves uploaded images statically from `/uploads`. Global concerns: helmet, CORS (allows :3000 and :5173), a 100-req/15-min rate limiter on `/api/`, a 10mb JSON body limit, and a global error handler that special-cases multer `LIMIT_FILE_SIZE`.

Auth is JWT-based with a **single admin user** (no user collection). `auth` routes validate credentials against `admin.json` (bcrypt hash) and against `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Protected routes use `middleware/auth.js` `protect`, which expects a `Bearer` token and attaches `req.user = { email }`. Public GET endpoints are unauthenticated; all create/update/delete and image upload endpoints are `protect`ed.

Image uploads use `middleware/upload.js` (multer disk storage → `server/uploads/`, images only, 5MB cap). Upload endpoints return the updated record with `/uploads/...` paths appended to its `images`.

Note: API response shapes are inconsistent — some endpoints return the bare object/array (e.g. `GET /api/properties` → `{ properties, total, page, pages }`, `GET /:slug` → the object), others wrap in `{ success, message, data }`. Match the existing shape of the endpoint you touch.

### Client

React 19 SPA. `main.jsx` wraps the app in nested providers (order matters): `HelmetProvider → BrowserRouter → ThemeProvider → SettingsProvider → AuthProvider`. Routing in `App.jsx` is split into a public `Layout` tree (home, properties, property detail by `:slug`, about, contact) and an `/admin` tree behind `AdminLayout`. All pages are `lazy`-loaded behind a `LoadingScreen` Suspense fallback.

`AdminLayout` is the auth guard: it redirects to `/admin/login` when `useAuth()` reports unauthenticated after loading. `AuthContext` stores the JWT in `localStorage` under `avikesh-admin-token` and re-validates it on mount via `/api/auth/me`.

The client talks to the API via relative `/api` paths; Vite's dev proxy (`vite.config.js`) forwards `/api` and `/uploads` to `http://localhost:5001`. Build uses manual chunks (vendor / framer-motion / swiper).

Styling is Tailwind CSS v4 via `@tailwindcss/vite` (no separate config file). Animation stack: framer-motion, gsap, swiper, react-intersection-observer. `client/src/data/*.js` holds static fallback/demo content separate from the API-backed data.

## Environment

`server/.env` provides `PORT` (5001), `JWT_SECRET`, `JWT_EXPIRE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. The client port (3000) and proxy target (5001) are hardcoded in `vite.config.js` — keep them in sync with the server `PORT`.
