export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: { weekday_text: string[] };
  types: string[];
}

export interface GoogleReview {
  author_name: string;
  author_url: string;
  rating: number;
  text: string;
  time: number;
}

const BASE = "https://maps.googleapis.com/maps/api";

export async function searchGooglePlaces(
  query: string,
  lat: number,
  lng: number,
  radius = 5000
): Promise<GooglePlace[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set");

  const url = `${BASE}/place/nearbysearch/json?keyword=${encodeURIComponent(
    query
  )}&location=${lat},${lng}&radius=${radius}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Places API error: ${data.status}`);
  }

  return data.results || [];
}

export async function getGooglePlaceDetails(placeId: string): Promise<GooglePlace | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set");

  const fields =
    "place_id,name,formatted_address,geometry,rating,user_ratings_total,formatted_phone_number,website,opening_hours,types,reviews";

  const url = `${BASE}/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK") return null;

  return data.result;
}

export async function getGoogleReviews(placeId: string): Promise<GoogleReview[]> {
  const details = await getGooglePlaceDetails(placeId);
  if (!details) return [];
  return (details as any).reviews || [];
}
