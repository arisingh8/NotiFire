"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MapStyles } from "./styles";

export interface MapPoint {
  id: number;
  lat: number;
  lng: number;
  type: "fire" | "unit" | "resident";
  details?: {
    title: string;
    description: string;
    severity?: "low" | "medium" | "high";
  };
}

interface MapProps {
  center: [number, number];
  points?: MapPoint[];
  radius?: number; // in miles
  onMarkerClick?: (point: MapPoint) => void;
}

// Dynamic import with SSR disabled
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className={MapStyles.loading}>Loading map...</div>,
});

const Map: React.FC<MapProps> = (props) => {
  return <LeafletMap {...props} />;
};

export default Map;
