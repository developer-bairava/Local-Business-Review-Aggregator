import { NextRequest, NextResponse } from "next/server";
import { mockBusinesses } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const location = searchParams.get("location")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "";
  const minRating = parseFloat(searchParams.get("minRating") ?? "0");

  const useMock =
    !process.env.GOOGLE_PLACES_API_KEY && !process.env.YELP_API_KEY;

  if (useMock) {
    let results = mockBusinesses;

    if (query) {
      results = results.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query)
      );
    }

    if (location) {
      results = results.filter(
        (b) =>
          b.city.toLowerCase().includes(location) ||
          b.state.toLowerCase().includes(location) ||
          (b.zip && b.zip.includes(location))
      );
    }

    if (category) {
      results = results.filter((b) => b.category === category);
    }

    if (minRating > 0) {
      results = results.filter(
        (b) => (b.aggregatedScore?.avgRating ?? 0) >= minRating
      );
    }

    return NextResponse.json({ results, total: results.length, mode: "mock" });
  }

  // Production: use real APIs
  try {
    // TODO: Implement real geocoding + Google Places + Yelp search
    return NextResponse.json({ results: [], total: 0, mode: "live" });
  } catch (err) {
    return NextResponse.json(
      { error: "Search failed", message: String(err) },
      { status: 500 }
    );
  }
}
