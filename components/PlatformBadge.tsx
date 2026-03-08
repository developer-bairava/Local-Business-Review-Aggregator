import clsx from "clsx";

const PLATFORM_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  google: {
    label: "Google",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  yelp: {
    label: "Yelp",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
  },
  tripadvisor: {
    label: "TripAdvisor",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
  },
  foursquare: {
    label: "Foursquare",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  mock: {
    label: "Demo",
    color: "text-gray-700",
    bg: "bg-gray-50 border-gray-200",
  },
};

export default function PlatformBadge({ platform }: { platform: string }) {
  const config = PLATFORM_CONFIG[platform] ?? {
    label: platform,
    color: "text-gray-700",
    bg: "bg-gray-50 border-gray-200",
  };

  return (
    <span
      className={clsx(
        "text-xs font-medium px-2 py-0.5 rounded-full border",
        config.color,
        config.bg
      )}
    >
      {config.label}
    </span>
  );
}
