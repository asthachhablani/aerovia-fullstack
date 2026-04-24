# Aerovia

AI-powered travel booking experience — a React + Vite frontend backed by a
Node/Express API. Optimised to run end-to-end inside Replit with **zero
external services required** (MongoDB and Gemini are both optional).

## Architecture

```
aerovia-frontend/   Vite + React 18 + TypeScript SPA (port 5000)
aerovia-backend/    Express ESM API (port 3001)
```

The Vite dev server proxies `/api/*` to the local Express server, so the
frontend always uses a relative `BASE_URL` (`/api`) and there are no CORS
or origin headaches in development.

### Storage modes

The backend boots in one of two modes, decided at startup:

- **MongoDB mode** — used when `MONGODB_URI` is set in `aerovia-backend/.env`.
  Uses Mongoose models for `User`, `Booking`, and `Wishlist`.
- **In-memory mode** (default in Replit) — `data/memoryStore.js` provides a
  tiny mongoose-compatible substitute. Same route code, same shapes, but data
  resets on restart. Perfect for demos.

The `models/*.js` files conditionally export the in-memory or Mongoose
implementation based on the `USE_MEMORY_DB` environment variable, which
`server.js` sets before any route module is imported.

### AI concierge

The `/api/chat` endpoint uses Google Gemini when `GEMINI_API_KEY` is set;
otherwise it returns curated, on-brand demo replies (Tokyo, Iceland, Morocco,
budget, beach, adventure, packages, flights, generic greetings) so the AI
chat panel is always functional out-of-the-box. Errors during a live call
also degrade gracefully to a demo reply rather than failing.

## Workflows

| Workflow            | Command                                           | Port | Purpose            |
| ------------------- | ------------------------------------------------- | ---- | ------------------ |
| `Backend`           | `cd aerovia-backend && node server.js`            | 3001 | Express API        |
| `Start application` | `cd aerovia-frontend && ./node_modules/.bin/vite` | 5000 | Vite dev (preview) |

## Environment variables

`aerovia-backend/.env` (already provisioned with safe demo defaults):

- `MONGODB_URI` — leave blank to use the in-memory store
- `JWT_SECRET` — defaulted to a stable demo value
- `JWT_EXPIRES_IN` — `7d`
- `GEMINI_API_KEY` — leave blank to use curated demo replies
- `PORT` — `3001`
- `CLIENT_URL` — optional, restricts CORS in production

`aerovia-frontend/.env.local`:

- `VITE_API_URL=/api` — relative URL goes through the Vite proxy

## Demo data

`aerovia-backend/data/demoData.js` contains 20 destinations, 30 flights,
20 hotels, 15 bus routes, 18 packages, deals, and airports — all served
through `/api/data/*`. Filtering, sorting, and a smart `/api/data/search`
endpoint are implemented.

## API surface

```
POST   /api/auth/register        Create account → { token, user }
POST   /api/auth/login           Authenticate   → { token, user }
GET    /api/auth/me              Current user (Bearer token)
GET    /api/user/profile         Profile (Bearer token)
PUT    /api/user/profile         Update profile
PUT    /api/user/password        Change password
GET    /api/bookings             List bookings (Bearer token)
POST   /api/bookings             Create booking
GET    /api/bookings/:id         Single booking
PATCH  /api/bookings/:id/cancel  Cancel booking
GET    /api/wishlist             List wishlist
POST   /api/wishlist             Add to wishlist
DELETE /api/wishlist/:itemId     Remove from wishlist
POST   /api/chat                 AI concierge (live or demo)
GET    /api/data/destinations    Destinations (region/maxPrice/search)
GET    /api/data/destinations/:id
GET    /api/data/flights         Flights (from/to/maxPrice/stops/airline/sortBy)
GET    /api/data/flights/:id
GET    /api/data/hotels          Hotels (city/minStars/maxPrice/search)
GET    /api/data/hotels/:id
GET    /api/data/buses           Buses
GET    /api/data/packages        Packages
GET    /api/data/packages/:id
GET    /api/data/deals
GET    /api/data/airports
GET    /api/data/search          Smart cross-search
GET    /api/health               Returns mode + AI status
```

## Notes for future work

- HMR over Replit's proxied preview prints a benign websocket warning;
  hot reload still works when accessed via the public domain.
- To enable persistence, drop a `MONGODB_URI` into `aerovia-backend/.env`
  and restart the `Backend` workflow.
- To enable live AI replies, drop a `GEMINI_API_KEY` into the same file.
