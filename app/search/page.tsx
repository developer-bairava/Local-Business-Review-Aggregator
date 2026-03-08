"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import BusinessCard from "@/components/BusinessCard";
import SearchBar from "@/components/SearchBar";
import { SlidersHorizontal, Loader2 } from "lucide-react";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Restaurants", value: "restaurant" },
  { label: "Cafes", value: "cafe" },
  { label: "Dentists", value: "dentist" },
  { label: "Spas", value: "spa" },
  { label: "Auto Repair", value: "auto_repair" },
  { label: "Bookstores", value: "bookstore" },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    if (!query) return;
    setLoading(true);

    const params = new URLSearchParams({ q: query });
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    if (minRating > 0) params.set("minRating", String(minRating));

    fetch(`/api/search?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results ?? []);
      })
      .finally(() => setLoading(false));
  }, [query, location, category, minRating]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar defaultQuery={query} defaultLocation={location} size="sm" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <aside className="md:w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </div>

            <div className="mb-4">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Category
              </div>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      category === cat.value
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Min Rating
              </div>
              <div className="space-y-1">
                {[0, 3, 3.5, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      minRating === r
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {r === 0 ? "Any" : `${r}+ stars`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {query && (
            <div className="text-sm text-gray-500 mb-4">
              {loading ? "Searching..." : `${results.length} results for "${query}"`}
              {location ? ` in "${location}"` : ""}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((b) => (
                <BusinessCard key={b.id} {...b} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              {query ? "No businesses found. Try a different search." : "Enter a search term above."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
