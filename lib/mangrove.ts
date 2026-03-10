export interface MangroveReview {
  signature: string;
  payload: {
    sub: string;
    rating?: number;   // 0–100 scale
    opinion?: string;
    metadata?: {
      display_name?: string;
      is_affiliated?: boolean;
    };
    iat: number;       // issued at (unix timestamp)
  };
  kid: string;
}

const BASE = "https://api.mangrove.reviews";

// Build a geo: subject URI from lat/lng/name
export function buildGeoUri(lat: number, lng: number, name?: string): string {
  let uri = `geo:${lat},${lng}`;
  if (name) uri += `?q=${encodeURIComponent(name)}&u=50`;
  return uri;
}

// Normalize Mangrove 0–100 rating to 1–5 scale
function normalizeRating(r: number): number {
  const scaled = Math.round((r / 100) * 4 + 1);
  return Math.min(5, Math.max(1, scaled));
}

export async function getMangroveReviews(
  lat: number,
  lng: number,
  name?: string
): Promise<MangroveReview[]> {
  const sub = buildGeoUri(lat, lng, name);
  const url = `${BASE}/reviews?sub=${encodeURIComponent(sub)}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return [];

  const data = await res.json();
  return data.reviews ?? [];
}

export async function getMangroveReviewsByBounds(
  lat: number,
  lng: number,
  radiusDeg = 0.005
): Promise<MangroveReview[]> {
  const url = `${BASE}/geo?xmin=${lng - radiusDeg}&ymin=${lat - radiusDeg}&xmax=${lng + radiusDeg}&ymax=${lat + radiusDeg}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return [];

  const data = await res.json();
  return data.reviews ?? [];
}

export function toNormalizedReviews(reviews: MangroveReview[]) {
  return reviews
    .filter((r) => r.payload?.rating !== undefined)
    .map((r) => ({
      id: r.signature,
      platform: "mangrove" as const,
      rating: normalizeRating(r.payload.rating!),
      text: r.payload.opinion ?? "",
      author: r.payload.metadata?.display_name ?? "Anonymous",
      date: new Date(r.payload.iat * 1000),
      verified: false,
    }));
}
