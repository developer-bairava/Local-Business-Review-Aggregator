"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon in webpack
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Business {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  aggregatedScore?: { avgRating: number };
}

interface MapProps {
  businesses: Business[];
  center?: [number, number];
  zoom?: number;
}

export default function Map({ businesses, center, zoom = 13 }: MapProps) {
  const mapCenter: [number, number] = center ??
    (businesses.length > 0
      ? [businesses[0].lat, businesses[0].lng]
      : [37.7749, -122.4194]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {businesses.map((b) => (
        <Marker key={b.id} position={[b.lat, b.lng]} icon={icon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{b.name}</p>
              <p className="text-gray-500 text-xs">{b.address}</p>
              {b.aggregatedScore && (
                <p className="text-yellow-600 font-medium">
                  ⭐ {b.aggregatedScore.avgRating.toFixed(1)}
                </p>
              )}
              <a href={`/business/${b.id}`} className="text-blue-600 text-xs hover:underline">
                View details →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
