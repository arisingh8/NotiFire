"use client";

import React, { useState, useEffect } from "react";
import Map from "@/app/components/map";
import ResponderSummarySidebar from "@/app/components/sidebar/ResponderSummarySidebar";

// Define the MapPoint type to match the one in Map component
interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  type: "fire" | "unit" | "resident";
  details?: {
    title: string;
    description: string;
    severity?: "low" | "medium" | "high";
  };
}

interface SummaryData {
  firefighter: string;
  emt: string;
  police: string;
}

export default function FirstResponderDashboard() {
  const center: [number, number] = [34.0522, -118.2437]; // Los Angeles coordinates
  const [showSummarySidebar, setShowSummarySidebar] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [fireData, setFireData] = useState<MapPoint[]>([]);

  useEffect(() => {
    const fetchFireData = async () => {
      try {
        console.log("Fetching fire data...");
        const response = await fetch("http://127.0.0.1:8000/fires");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched fire data:", data);

        const formattedFires = data.map((fire: any) => ({
          id: fire.id,
          lat: fire.latitude,
          lng: fire.longitude,
          type: "fire" as const,
          details: {
            title: `Fire ${fire.id.substring(0, 4)}`,
            description: `Confidence: ${fire.confidence}%`,
            severity:
              fire.confidence >= 80 ? "high" : fire.confidence >= 50 ? "medium" : "low",
          },
        }));

        setFireData(formattedFires);
      } catch (error) {
        console.error("Error fetching fire data:", error);
      }
    };

    fetchFireData();
  }, []);

  const handleMarkerClick = async (point: MapPoint) => {
    console.log("🔥 Marker clicked:", point);

    try {
      console.log("📩 Sending request to generate summary...");

      // Use GET method (no need to specify method or headers)
      const response = await fetch(`http://127.0.0.1:8000/generate-summary?fire_id=${point.id}`);

      if (!response.ok) {
        throw new Error(`Error generating summary: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Summary generated:", data);

      setSummaryData(data);
      setShowSummarySidebar(true);
    } catch (error) {
      console.error("❌ Error in handleMarkerClick:", error);
    }
  };

  return (
    <main className="fixed inset-0 w-full h-full">
      <div className="absolute inset-0 w-full h-full">
        <Map center={center} points={fireData} radius={50} onMarkerClick={handleMarkerClick} />
      </div>

      <ResponderSummarySidebar
        isOpen={showSummarySidebar}
        onClose={() => setShowSummarySidebar(false)}
        summaries={summaryData}
      />
    </main>
  );
}
