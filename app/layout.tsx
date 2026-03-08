import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Star } from "lucide-react";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReviewHub — Local Business Reviews Aggregated",
  description:
    "Find the best local businesses with aggregated ratings from Google, Yelp, TripAdvisor and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ReviewHub
            </Link>
            <nav className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/search?q=restaurant" className="hover:text-blue-700">
                Restaurants
              </Link>
              <Link href="/search?q=cafe" className="hover:text-blue-700">
                Cafes
              </Link>
              <Link href="/search?q=spa" className="hover:text-blue-700">
                Services
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-400">
          <p>ReviewHub — Aggregating reviews from Google, Yelp &amp; more</p>
        </footer>
      </body>
    </html>
  );
}
