import SearchBar from "@/components/SearchBar";
import BusinessCard from "@/components/BusinessCard";
import { mockBusinesses } from "@/lib/mock-data";
import { Star, TrendingUp, Shield, Zap } from "lucide-react";

const CATEGORIES = [
  { label: "Restaurants", query: "restaurant", icon: "🍽️" },
  { label: "Cafes", query: "cafe", icon: "☕" },
  { label: "Dentists", query: "dentist", icon: "🦷" },
  { label: "Spas", query: "spa", icon: "💆" },
  { label: "Auto Repair", query: "auto_repair", icon: "🔧" },
  { label: "Bookstores", query: "bookstore", icon: "📚" },
];

export default function Home() {
  // Show top-rated businesses on homepage
  const topBusinesses = [...mockBusinesses]
    .sort((a, b) => (b.aggregatedScore?.avgRating ?? 0) - (a.aggregatedScore?.avgRating ?? 0))
    .slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            <h1 className="text-4xl font-bold">ReviewHub</h1>
          </div>
          <p className="text-xl text-blue-100 mb-3">
            All reviews. One search.
          </p>
          <p className="text-blue-200 mb-10 max-w-xl mx-auto">
            We aggregate ratings from Google, Yelp, TripAdvisor and more — so you
            can find the best local businesses in seconds.
          </p>
          <div className="flex justify-center">
            <SearchBar size="lg" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.query}
              href={`/search?q=${cat.query}`}
              className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl py-4 px-3 hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {cat.label}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Top Rated Nearby
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topBusinesses.map((b) => (
            <BusinessCard key={b.id} {...b} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <a
            href="/search?q=restaurant"
            className="inline-block bg-blue-50 text-blue-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
          >
            View all businesses
          </a>
        </div>
      </section>

      {/* Why ReviewHub */}
      <section className="bg-white border-t border-gray-100 py-14 px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Why ReviewHub?
          </h2>
          <p className="text-gray-500 mt-2">
            Stop switching between apps. We do the work for you.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Aggregated Ratings
            </h3>
            <p className="text-sm text-gray-500">
              We combine ratings from multiple platforms to give you the most
              accurate score.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Trustworthy Reviews
            </h3>
            <p className="text-sm text-gray-500">
              Cross-platform verification reduces the impact of fake or biased
              reviews.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-purple-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Decide Faster
            </h3>
            <p className="text-sm text-gray-500">
              One search. All the information you need to make a confident
              choice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
