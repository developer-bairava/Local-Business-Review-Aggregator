export interface YelpBusiness {
  id: string;
  name: string;
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  coordinates: { latitude: number; longitude: number };
  rating: number;
  review_count: number;
  phone: string;
  url: string;
  categories: { alias: string; title: string }[];
}

export interface YelpReview {
  id: string;
  rating: number;
  text: string;
  time_created: string;
  user: { name: string; profile_url: string };
}

const BASE = "https://api.yelp.com/v3";

function yelpHeaders() {
  const apiKey = process.env.YELP_API_KEY;
  if (!apiKey) throw new Error("YELP_API_KEY not set");
  return { Authorization: `Bearer ${apiKey}` };
}

export async function searchYelpBusinesses(
  query: string,
  lat: number,
  lng: number,
  radius = 5000
): Promise<YelpBusiness[]> {
  const url = `${BASE}/businesses/search?term=${encodeURIComponent(
    query
  )}&latitude=${lat}&longitude=${lng}&radius=${radius}&limit=20`;

  const res = await fetch(url, { headers: yelpHeaders() });
  const data = await res.json();

  if (!res.ok) throw new Error(`Yelp API error: ${data.error?.description}`);

  return data.businesses || [];
}

export async function getYelpBusinessDetails(yelpId: string): Promise<YelpBusiness | null> {
  const res = await fetch(`${BASE}/businesses/${yelpId}`, {
    headers: yelpHeaders(),
  });

  if (!res.ok) return null;
  return res.json();
}

export async function getYelpReviews(yelpId: string): Promise<YelpReview[]> {
  const res = await fetch(`${BASE}/businesses/${yelpId}/reviews?limit=20`, {
    headers: yelpHeaders(),
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.reviews || [];
}
