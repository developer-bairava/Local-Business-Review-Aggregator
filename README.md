# ReviewHub — Local Business Review Aggregator

A Next.js app that aggregates business listings and reviews from multiple open sources into a single searchable interface.

## Features

- **Business search** powered by OpenStreetMap / Overpass API (no API key required)
- **Real reviews** from Mangrove Reviews (open, decentralised review network)
- **User accounts** — register, sign in, submit your own reviews
- **Interactive map** view alongside list view (Leaflet + OpenStreetMap tiles)
- **Aggregated ratings** — weighted average across all platforms
- **Mock mode** — fully functional offline with hardcoded sample data

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite via `better-sqlite3` (dev) |
| ORM | Prisma 7 |
| Auth | NextAuth v5 (JWT, credentials) |
| Maps | Leaflet + React-Leaflet |
| Business data | OpenStreetMap / Overpass API |
| Reviews | Mangrove Reviews API |
| Geocoding | Nominatim (OpenStreetMap) |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` (already included as a template):

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-any-random-string"

# Force mock data (optional, for offline testing)
USE_MOCK_DATA="false"
```

### 3. Set up the database

```bash
npx prisma migrate dev --name init
```

This creates `dev.db` (SQLite) with all required tables.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | SQLite: `file:./dev.db` or PostgreSQL URL |
| `NEXTAUTH_URL` | Yes | Full URL of the app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Yes | Any random secret string (min 32 chars in prod) |
| `USE_MOCK_DATA` | No | Set to `"true"` to bypass live APIs and use hardcoded data |

No third-party API keys are required. All data sources (Overpass, Mangrove, Nominatim, OSM tiles) are free and open.

## Project Structure

```
app/
  page.tsx                  # Homepage with search + top-rated
  search/page.tsx           # Search results with list/map toggle
  business/[id]/page.tsx    # Business detail with reviews + review form
  login/page.tsx
  register/page.tsx
  api/
    search/route.ts         # GET /api/search
    business/[id]/route.ts  # GET /api/business/[id]
    reviews/[id]/route.ts   # GET + POST /api/reviews/[id]
    auth/[...nextauth]/     # NextAuth handler
    auth/register/          # User registration

components/
  Map.tsx                   # Leaflet map (client-only, dynamic import)
  BusinessMapWrapper.tsx    # SSR-safe map wrapper for business pages
  ReviewForm.tsx            # Star-picker review submission form
  AuthButton.tsx            # Session-aware sign in / sign out button
  Providers.tsx             # NextAuth SessionProvider wrapper
  BusinessCard.tsx
  ReviewCard.tsx
  RatingBreakdown.tsx
  StarRating.tsx
  SearchBar.tsx
  PlatformBadge.tsx

lib/
  db.ts                     # Prisma singleton (SQLite adapter)
  auth.ts                   # NextAuth config
  aggregator.ts             # Review aggregation logic
  overpass.ts               # OpenStreetMap / Overpass API client
  mangrove.ts               # Mangrove Reviews API client
  geocoding.ts              # Nominatim geocoding
  mock-data.ts              # Hardcoded sample data (mock mode)

prisma/
  schema.prisma             # Business, Review, User, UserReview models
```

## API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/search?q=&location=&category=&minRating=` | Search businesses |
| `GET` | `/api/business/[id]` | Fetch business details |
| `GET` | `/api/reviews/[id]` | Fetch aggregated reviews |
| `POST` | `/api/reviews/[id]` | Submit a review (requires auth) |
| `POST` | `/api/auth/register` | Create a new account |

## Mock Mode

Set `USE_MOCK_DATA="true"` in `.env.local` to use the 6 hardcoded businesses in `lib/mock-data.ts`. Useful for UI development without network calls.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint

npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma migrate dev --name <name>   # Run a new migration
npx prisma studio    # Open Prisma DB browser at http://localhost:5555
```

## Database

The app uses **SQLite** (`dev.db`) out of the box — no database server needed. To switch to PostgreSQL for production, update `DATABASE_URL` and the Prisma datasource provider in `prisma/schema.prisma`.
