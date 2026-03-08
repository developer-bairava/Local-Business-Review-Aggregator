"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  defaultQuery?: string;
  defaultLocation?: string;
  size?: "sm" | "lg";
}

export default function SearchBar({
  defaultQuery = "",
  defaultLocation = "",
  size = "lg",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [location, setLocation] = useState(defaultLocation);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query.trim() });
    if (location.trim()) params.set("location", location.trim());
    router.push(`/search?${params.toString()}`);
  };

  const isLarge = size === "lg";

  return (
    <form
      onSubmit={handleSearch}
      className={`flex flex-col sm:flex-row gap-2 w-full ${
        isLarge ? "max-w-3xl" : "max-w-2xl"
      }`}
    >
      <div className="relative flex-1">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
            isLarge ? "w-5 h-5" : "w-4 h-4"
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "restaurant", "dentist", "coffee"...'
          className={`w-full pl-10 pr-4 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isLarge ? "py-3.5 text-base" : "py-2.5 text-sm"
          }`}
        />
      </div>

      <div className="relative sm:w-52">
        <MapPin
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
            isLarge ? "w-5 h-5" : "w-4 h-4"
          }`}
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or ZIP"
          className={`w-full pl-10 pr-4 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isLarge ? "py-3.5 text-base" : "py-2.5 text-sm"
          }`}
        />
      </div>

      <button
        type="submit"
        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors ${
          isLarge ? "px-8 py-3.5 text-base" : "px-6 py-2.5 text-sm"
        }`}
      >
        Search
      </button>
    </form>
  );
}
