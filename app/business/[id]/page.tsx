import { notFound } from "next/navigation";
import { mockBusinesses, mockReviews } from "@/lib/mock-data";
import { aggregateReviews, NormalizedReview } from "@/lib/aggregator";
import RatingBreakdown from "@/components/RatingBreakdown";
import ReviewCard from "@/components/ReviewCard";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import BusinessMapWrapper from "@/components/BusinessMapWrapper";
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BusinessPage({ params }: PageProps) {
  const { id } = await params;

  const business = mockBusinesses.find((b) => b.id === id);
  if (!business) notFound();

  // Build aggregated reviews
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

  const aggregated = groups.length > 0
    ? aggregateReviews(groups)
    : {
        avgRating: business.aggregatedScore?.avgRating ?? 0,
        totalReviews: business.aggregatedScore?.totalReviews ?? 0,
        breakdown: [
          ...(business.aggregatedScore?.googleRating
            ? [{ platform: "google", rating: business.aggregatedScore.googleRating, count: business.aggregatedScore.googleCount ?? 0 }]
            : []),
          ...(business.aggregatedScore?.yelpRating
            ? [{ platform: "yelp", rating: business.aggregatedScore.yelpRating, count: business.aggregatedScore.yelpCount ?? 0 }]
            : []),
        ],
        reviews: [],
      };

  const hours = business.hours?.weekday_text ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/search?q=restaurant"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to results
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Business Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {business.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={aggregated.avgRating} size="md" showNumber />
                  <span className="text-sm text-gray-500">
                    ({aggregated.totalReviews.toLocaleString()} reviews)
                  </span>
                </div>
                <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full capitalize">
                  {business.category.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                <span>
                  {business.address}, {business.city}, {business.state}{" "}
                  {business.zip}
                </span>
              </div>
              {business.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <a href={`tel:${business.phone}`} className="hover:text-blue-600">
                    {business.phone}
                  </a>
                </div>
              )}
              {business.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {business.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <BusinessMapWrapper
            id={business.id}
            name={business.name}
            address={business.address}
            lat={business.lat}
            lng={business.lng}
            aggregatedScore={business.aggregatedScore}
          />

          {/* Hours */}
          {hours.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                <Clock className="w-4 h-4" />
                Opening Hours
              </h2>
              <div className="space-y-1.5">
                {hours.map((line, i) => {
                  const [day, time] = line.split(": ");
                  return (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">{day}</span>
                      <span className="text-gray-500">{time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Reviews ({reviews.length})
            </h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {aggregated.reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-200">
                No detailed reviews available yet.
              </div>
            )}
          </div>

          {/* Review Form */}
          <ReviewForm businessId={id} />
        </div>

        {/* Right: Rating Breakdown */}
        <div className="space-y-4">
          <RatingBreakdown
            avgRating={aggregated.avgRating}
            totalReviews={aggregated.totalReviews}
            breakdown={aggregated.breakdown}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-medium mb-1">About this rating</p>
            <p className="text-blue-600">
              This score is calculated by combining ratings from multiple platforms
              to give you the most accurate and unbiased result.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
