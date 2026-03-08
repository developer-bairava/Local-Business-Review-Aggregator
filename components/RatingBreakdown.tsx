import { getRatingLabel, getRatingColor } from "@/lib/aggregator";
import StarRating from "./StarRating";
import clsx from "clsx";

interface BreakdownItem {
  platform: string;
  rating: number;
  count: number;
}

interface RatingBreakdownProps {
  avgRating: number;
  totalReviews: number;
  breakdown: BreakdownItem[];
}

const PLATFORM_LABELS: Record<string, string> = {
  google: "Google",
  yelp: "Yelp",
  tripadvisor: "TripAdvisor",
  foursquare: "Foursquare",
  mock: "Demo",
};

export default function RatingBreakdown({
  avgRating,
  totalReviews,
  breakdown,
}: RatingBreakdownProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Aggregated Rating
      </h2>

      <div className="flex items-center gap-4 mb-6">
        <div className={clsx("text-5xl font-bold", getRatingColor(avgRating))}>
          {avgRating.toFixed(1)}
        </div>
        <div>
          <StarRating rating={avgRating} size="lg" />
          <div className={clsx("font-semibold mt-1", getRatingColor(avgRating))}>
            {getRatingLabel(avgRating)}
          </div>
          <div className="text-sm text-gray-500">
            {totalReviews.toLocaleString()} total reviews
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 mb-2">
          By Platform
        </div>
        {breakdown.map((item) => (
          <div key={item.platform} className="flex items-center gap-3">
            <div className="w-24 text-sm text-gray-600 font-medium">
              {PLATFORM_LABELS[item.platform] ?? item.platform}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${(item.rating / 5) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1 w-16 justify-end">
              <span className="text-sm font-semibold text-gray-800">
                {item.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">({item.count})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
