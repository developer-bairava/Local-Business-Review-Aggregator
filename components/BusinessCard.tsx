import Link from "next/link";
import { MapPin, Phone, ExternalLink } from "lucide-react";
import StarRating from "./StarRating";
import { getRatingLabel, getRatingColor } from "@/lib/aggregator";
import clsx from "clsx";

interface BusinessCardProps {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  category: string;
  phone?: string | null;
  aggregatedScore?: {
    avgRating: number;
    totalReviews: number;
    googleRating?: number | null;
    googleCount?: number | null;
    yelpRating?: number | null;
    yelpCount?: number | null;
  } | null;
}

const CATEGORY_ICONS: Record<string, string> = {
  restaurant: "🍽️",
  cafe: "☕",
  dentist: "🦷",
  spa: "💆",
  auto_repair: "🔧",
  bookstore: "📚",
  gym: "💪",
  hotel: "🏨",
  pharmacy: "💊",
  grocery: "🛒",
};

export default function BusinessCard({
  id,
  name,
  address,
  city,
  state,
  category,
  phone,
  aggregatedScore,
}: BusinessCardProps) {
  const icon = CATEGORY_ICONS[category] ?? "🏪";
  const rating = aggregatedScore?.avgRating ?? 0;

  return (
    <Link href={`/business/${id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
                {name}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {address}, {city}, {state}
                </span>
              </div>
              {phone && (
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>{phone}</span>
                </div>
              )}
            </div>
          </div>

          {aggregatedScore && (
            <div className="flex flex-col items-end flex-shrink-0">
              <div
                className={clsx(
                  "text-2xl font-bold",
                  getRatingColor(rating)
                )}
              >
                {rating.toFixed(1)}
              </div>
              <StarRating rating={rating} size="sm" />
              <div className="text-xs text-gray-400 mt-0.5">
                {aggregatedScore.totalReviews.toLocaleString()} reviews
              </div>
            </div>
          )}
        </div>

        {aggregatedScore && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
            {aggregatedScore.googleRating && (
              <span>
                Google{" "}
                <span className="font-semibold text-gray-700">
                  {aggregatedScore.googleRating.toFixed(1)}
                </span>{" "}
                ({aggregatedScore.googleCount})
              </span>
            )}
            {aggregatedScore.yelpRating && (
              <span>
                Yelp{" "}
                <span className="font-semibold text-gray-700">
                  {aggregatedScore.yelpRating.toFixed(1)}
                </span>{" "}
                ({aggregatedScore.yelpCount})
              </span>
            )}
            <span className="ml-auto capitalize text-blue-500 font-medium">
              {getRatingLabel(rating)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
