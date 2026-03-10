"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

interface BusinessMapWrapperProps {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  aggregatedScore?: { avgRating: number };
}

export default function BusinessMapWrapper({ id, name, address, lat, lng, aggregatedScore }: BusinessMapWrapperProps) {
  return (
    <div style={{ height: "280px" }} className="rounded-xl overflow-hidden border border-gray-200">
      <DynamicMap
        businesses={[{ id, name, address, lat, lng, aggregatedScore }]}
        center={[lat, lng]}
        zoom={15}
      />
    </div>
  );
}
