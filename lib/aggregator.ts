export interface NormalizedReview {
  id: string;
  platform: "google" | "yelp" | "tripadvisor" | "mock";
  rating: number;        // always 1-5
  text: string;
  author: string;
  authorUrl?: string;
  date: Date;
  verified: boolean;
}

export interface AggregatedResult {
  avgRating: number;
  totalReviews: number;
  breakdown: {
    platform: string;
    rating: number;
    count: number;
  }[];
  reviews: NormalizedReview[];
}

// Normalize different platforms' rating scales to 1-5
function normalizeRating(rating: number, platform: string): number {
  switch (platform) {
    case "tripadvisor": // already 1-5
      return rating;
    default:
      return rating;
  }
}

export function aggregateReviews(
  reviewGroups: { platform: string; rating: number; count: number; reviews: NormalizedReview[] }[]
): AggregatedResult {
  const allReviews: NormalizedReview[] = [];
  let totalWeightedRating = 0;
  let totalCount = 0;

  const breakdown = reviewGroups.map((group) => {
    const normalized = normalizeRating(group.rating, group.platform);
    totalWeightedRating += normalized * group.count;
    totalCount += group.count;
    allReviews.push(...group.reviews);
    return {
      platform: group.platform,
      rating: normalized,
      count: group.count,
    };
  });

  const avgRating = totalCount > 0 ? totalWeightedRating / totalCount : 0;

  // Sort reviews newest first
  allReviews.sort((a, b) => b.date.getTime() - a.date.getTime());

  return {
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews: totalCount,
    breakdown,
    reviews: allReviews,
  };
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  if (rating >= 3.0) return "Average";
  if (rating >= 2.0) return "Poor";
  return "Very Poor";
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-emerald-600";
  if (rating >= 4.0) return "text-green-600";
  if (rating >= 3.5) return "text-lime-600";
  if (rating >= 3.0) return "text-yellow-600";
  if (rating >= 2.0) return "text-orange-600";
  return "text-red-600";
}
