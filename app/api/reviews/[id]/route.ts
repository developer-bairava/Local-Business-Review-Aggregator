import { NextRequest, NextResponse } from "next/server";
import { mockReviews } from "@/lib/mock-data";
import { aggregateReviews, NormalizedReview } from "@/lib/aggregator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const useMock = !process.env.GOOGLE_PLACES_API_KEY && !process.env.YELP_API_KEY;

  if (useMock) {
    const reviews = (mockReviews[id] ?? []) as NormalizedReview[];

    if (reviews.length === 0) {
      return NextResponse.json({
        aggregated: { avgRating: 0, totalReviews: 0, breakdown: [], reviews: [] },
      });
    }

    // Group by platform
    const byPlatform: Record<string, NormalizedReview[]> = {};
    for (const r of reviews) {
      if (!byPlatform[r.platform]) byPlatform[r.platform] = [];
      byPlatform[r.platform].push(r);
    }

    const groups = Object.entries(byPlatform).map(([platform, items]) => {
      const avgRating =
        items.reduce((sum, r) => sum + r.rating, 0) / items.length;
      return { platform, rating: avgRating, count: items.length, reviews: items };
    });

    const aggregated = aggregateReviews(groups);

    return NextResponse.json({ aggregated });
  }

  // Production: fetch from Google + Yelp APIs, then aggregate
  try {
    // TODO: implement live API calls
    return NextResponse.json({ error: "Not implemented" }, { status: 501 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch reviews", message: String(err) },
      { status: 500 }
    );
  }
}
