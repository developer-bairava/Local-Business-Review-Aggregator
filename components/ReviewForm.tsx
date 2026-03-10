"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface ReviewFormProps {
  businessId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ businessId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Please select a rating"); return; }
    if (!text.trim()) { setError("Please write a review"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/reviews/${businessId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setError("Please sign in to leave a review");
        } else {
          setError(data.error ?? "Failed to submit review");
        }
      } else {
        setSuccess(true);
        setRating(0);
        setText("");
        onSuccess?.();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
        Your review was submitted successfully!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-gray-900">Write a Review</h3>

      {/* Star picker */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                star <= (hover || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-500 self-center">
          {rating ? `${rating} / 5` : "Select rating"}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your experience..."
        rows={4}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
