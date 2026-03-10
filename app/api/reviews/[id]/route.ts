import { NextRequest, NextResponse } from "next/server";
import { mockReviews } from "@/lib/mock-data";
import { aggregateReviews, NormalizedReview } from "@/lib/aggregator";
import { getMangroveReviewsByBounds, toNormalizedReviews } from "@/lib/mangrove";
import { getOverpassBusinessDetails } from "@/lib/overpass";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const useMock = process.env.USE_MOCK_DATA === "true";

  if (useMock) {
    const reviews = (mockReviews[id] ?? []) as NormalizedReview[];
    const byPlatform: Record<string, NormalizedReview[]> = {};
    for (const r of reviews) {
      if (!byPlatform[r.platform]) byPlatform[r.platform] = [];
      byPlatform[r.platform].push(r);
    }
    const groups = Object.entries(byPlatform).map(([platform, items]) => {
      const avgRating = items.reduce((sum, r) => sum + r.rating, 0) / items.length;
      return { platform, rating: avgRating, count: items.length, reviews: items };
    });

    // Also load user reviews from DB if available
    let userReviews: NormalizedReview[] = [];
    try {
      const dbReviews = await db.userReview.findMany({
        where: { businessId: id },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
      userReviews = dbReviews.map((r) => ({
        id: r.id,
        platform: "mock" as const,
        rating: r.rating,
        text: r.text,
        author: r.user.name ?? "Anonymous",
        date: r.createdAt,
        verified: true,
      }));
    } catch {}

    if (userReviews.length > 0) {
      groups.push({ platform: "user", rating: userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length, count: userReviews.length, reviews: userReviews });
    }

    const aggregated = groups.length > 0
      ? aggregateReviews(groups)
      : { avgRating: 0, totalReviews: 0, breakdown: [], reviews: [] };

    return NextResponse.json({ aggregated });
  }

  try {
    // Fetch Mangrove reviews for OSM businesses
    let mangroveReviews: NormalizedReview[] = [];
    if (id.startsWith("osm_")) {
      try {
        const osmId = id.replace("osm_", "");
        const place = await getOverpassBusinessDetails(osmId);
        if (place) {
          const raw = await getMangroveReviewsByBounds(place.lat, place.lng);
          mangroveReviews = toNormalizedReviews(raw);
        }
      } catch {}
    }

    // Load user reviews from DB
    let userReviews: NormalizedReview[] = [];
    try {
      const dbReviews = await db.userReview.findMany({
        where: { businessId: id },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
      userReviews = dbReviews.map((r) => ({
        id: r.id,
        platform: "mock" as const,
        rating: r.rating,
        text: r.text,
        author: r.user.name ?? "Anonymous",
        date: r.createdAt,
        verified: true,
      }));
    } catch {}

    const groups = [];
    if (mangroveReviews.length > 0) {
      const avg = mangroveReviews.reduce((s, r) => s + r.rating, 0) / mangroveReviews.length;
      groups.push({ platform: "mangrove", rating: avg, count: mangroveReviews.length, reviews: mangroveReviews });
    }
    if (userReviews.length > 0) {
      const avg = userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length;
      groups.push({ platform: "user", rating: avg, count: userReviews.length, reviews: userReviews });
    }

    const aggregated = groups.length > 0
      ? aggregateReviews(groups)
      : { avgRating: 0, totalReviews: 0, breakdown: [], reviews: [] };

    return NextResponse.json({ aggregated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch reviews", message: String(err) }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to leave a review" }, { status: 401 });
  }

  const { id } = await params;
  const { rating, text } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }
  if (!text?.trim()) {
    return NextResponse.json({ error: "Review text required" }, { status: 400 });
  }

  try {
    const review = await db.userReview.upsert({
      where: { userId_businessId: { userId: session.user.id, businessId: id } },
      update: { rating, text: text.trim() },
      create: { userId: session.user.id, businessId: id, rating, text: text.trim() },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save review", message: String(err) }, { status: 500 });
  }
}
