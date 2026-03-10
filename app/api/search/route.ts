import { NextRequest, NextResponse } from "next/server";
import { mockBusinesses } from "@/lib/mock-data";
import { searchOverpassBusinesses } from "@/lib/overpass";
import { geocodeLocation } from "@/lib/geocoding";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const location = searchParams.get("location")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "";
  const minRating = parseFloat(searchParams.get("minRating") ?? "0");

  const useMock = process.env.USE_MOCK_DATA === "true";

  if (useMock) {
    let results = mockBusinesses;
    if (query) results = results.filter((b) => b.name.toLowerCase().includes(query) || b.category.toLowerCase().includes(query));
    if (location) results = results.filter((b) => b.city.toLowerCase().includes(location) || b.state.toLowerCase().includes(location) || (b.zip && b.zip.includes(location)));
    if (category) results = results.filter((b) => b.category === category);
    if (minRating > 0) results = results.filter((b) => (b.aggregatedScore?.avgRating ?? 0) >= minRating);
    return NextResponse.json({ results, total: results.length, mode: "mock" });
  }

  try {
    // Geocode location string → lat/lng
    let lat = 37.7749, lng = -122.4194; // Default: San Francisco
    if (location) {
      const geo = await geocodeLocation(location);
      if (geo) { lat = geo.lat; lng = geo.lng; }
    }

    const term = query || "business";
    const osmPlaces = await searchOverpassBusinesses(term, lat, lng).catch(() => []);

    const merged: any[] = osmPlaces.map((p) => ({
      id: `osm_${p.id}`,
      externalId: p.id,
      source: "osm",
      name: p.name,
      address: p.address,
      city: p.city,
      state: p.state,
      zip: p.zip,
      country: p.country,
      lat: p.lat,
      lng: p.lng,
      category: p.category,
      phone: p.phone,
      website: p.website,
      aggregatedScore: { avgRating: 0, totalReviews: 0 },
    }));

    let results = merged;
    if (category) results = results.filter((b) => b.category.includes(category));
    if (minRating > 0) results = results.filter((b) => (b.aggregatedScore?.avgRating ?? 0) >= minRating);

    return NextResponse.json({ results, total: results.length, mode: "live" });
  } catch (err) {
    return NextResponse.json({ error: "Search failed", message: String(err) }, { status: 500 });
  }
}

// Suppress unused import warning - db is available for future use
void db;
