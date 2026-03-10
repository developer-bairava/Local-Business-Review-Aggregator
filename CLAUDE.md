# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

Database (requires `DATABASE_URL` in `.env.local`):
```bash
npx prisma generate   # Regenerate Prisma client after schema changes
npx prisma migrate dev  # Run migrations
```

## Architecture

**Next.js 16 App Router** with TypeScript and Tailwind CSS v4.

### Mock vs. Live mode

The app automatically runs in **mock mode** when neither `GOOGLE_PLACES_API_KEY` nor `YELP_API_KEY` is set in `.env.local`. All API routes check `useMock = !process.env.GOOGLE_PLACES_API_KEY && !process.env.YELP_API_KEY` and fall back to `lib/mock-data.ts`. Live API integrations are stubbed with `// TODO` comments.

### API Routes

- `GET /api/search?q=&location=&category=&minRating=` — search businesses
- `GET /api/business/[id]` — fetch single business details
- `GET /api/reviews/[id]` — fetch and aggregate reviews for a business

### Key `lib/` modules

- **`aggregator.ts`** — core logic: `NormalizedReview` and `AggregatedResult` types, `aggregateReviews()` (weighted average across platforms), `getRatingLabel()`, `getRatingColor()`
- **`google-places.ts`** — Google Places API client (`searchGooglePlaces`, `getGooglePlaceDetails`, `getGoogleReviews`); reads `GOOGLE_PLACES_API_KEY`
- **`yelp.ts`** — Yelp Fusion API client (`searchYelpBusinesses`, `getYelpBusinessDetails`, `getYelpReviews`); reads `YELP_API_KEY`
- **`db.ts`** — Prisma client placeholder (currently `null`); run `npx prisma generate` to activate
- **`mock-data.ts`** — static `mockBusinesses` array and `mockReviews` map keyed by business ID

### Database schema (Prisma / PostgreSQL)

Four models: `Business` → `ReviewSource` (one per platform, unique on `[businessId, platform]`) → `Review`, plus `AggregatedScore` (1:1 with `Business`). All ratings are stored as 1–5 floats.

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_PLACES_API_KEY` | Google Places API |
| `YELP_API_KEY` | Yelp Fusion API |
