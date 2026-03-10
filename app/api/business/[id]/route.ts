import { NextRequest, NextResponse } from "next/server";
import { mockBusinesses } from "@/lib/mock-data";
import { getOverpassBusinessDetails } from "@/lib/overpass";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const useMock = process.env.USE_MOCK_DATA === "true";

  if (useMock) {
    const business = mockBusinesses.find((b) => b.id === id);
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });
    return NextResponse.json(business);
  }

  try {
    if (id.startsWith("osm_")) {
      const osmId = id.replace("osm_", "");
      const place = await getOverpassBusinessDetails(osmId);
      if (!place) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({
        id,
        name: place.name,
        address: place.address,
        city: place.city,
        state: place.state,
        zip: place.zip,
        country: place.country,
        lat: place.lat,
        lng: place.lng,
        category: place.category,
        phone: place.phone,
        website: place.website,
        hours: place.hours ? { weekday_text: [place.hours] } : null,
        aggregatedScore: { avgRating: 0, totalReviews: 0 },
      });
    }

    return NextResponse.json({ error: "Unknown business ID format" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch business", message: String(err) }, { status: 500 });
  }
}
