import { NextRequest, NextResponse } from "next/server";
import { mockBusinesses } from "@/lib/mock-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const useMock = !process.env.GOOGLE_PLACES_API_KEY && !process.env.YELP_API_KEY;

  if (useMock) {
    const business = mockBusinesses.find((b) => b.id === id);
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }
    return NextResponse.json(business);
  }

  // Production: query DB
  try {
    // TODO: fetch from database via prisma
    return NextResponse.json({ error: "Not implemented" }, { status: 501 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch business", message: String(err) },
      { status: 500 }
    );
  }
}
