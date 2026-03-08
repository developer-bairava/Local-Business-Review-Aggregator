"use client";

import { Star } from "lucide-react";
import clsx from "clsx";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  showNumber = false,
}: StarRatingProps) {
  const sizeClass = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  }[size];

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;

        return (
          <span key={i} className="relative inline-block">
            <Star
              className={clsx(sizeClass, "text-gray-200")}
              fill="currentColor"
            />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : `${(rating % 1) * 100}%` }}
              >
                <Star
                  className={clsx(sizeClass, "text-yellow-400")}
                  fill="currentColor"
                />
              </span>
            )}
          </span>
        );
      })}
      {showNumber && (
        <span className="ml-1 font-semibold text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
