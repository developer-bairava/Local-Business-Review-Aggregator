import { NormalizedReview } from "@/lib/aggregator";
import StarRating from "./StarRating";
import PlatformBadge from "./PlatformBadge";
import { CheckCircle } from "lucide-react";

interface ReviewCardProps {
  review: NormalizedReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const timeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
            {review.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-gray-900 text-sm">
                {review.author}
              </span>
              {review.verified && (
                <CheckCircle className="w-3.5 h-3.5 text-green-500" aria-label="Verified review" />
              )}
            </div>
            <div className="text-xs text-gray-400">{timeAgo(review.date)}</div>
          </div>
        </div>
        <PlatformBadge platform={review.platform} />
      </div>

      <div className="mt-3">
        <StarRating rating={review.rating} size="sm" showNumber />
      </div>

      {review.text && (
        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-4">
          {review.text}
        </p>
      )}
    </div>
  );
}
