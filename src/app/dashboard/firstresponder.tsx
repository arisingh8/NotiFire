"use client";

import React, { useState } from "react";
import Map from "@/app/components/map";
import ResponderSummarySidebar from "@/app/components/sidebar/ResponderSummarySidebar";
import { MapPoint } from "@/app/components/map";

interface SummaryData {
  firefighter: string;
  emt: string;
  police: string;
}

export default function FirstResponderDashboard({
  fires,
  center,
}: {
  fires: MapPoint[];
  center: [number, number];
}) {
  const [showSummarySidebar, setShowSummarySidebar] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const handleMarkerClick = async (point: MapPoint) => {
    console.log("🔥 Marker clicked:", point);

    try {
      console.log("📩 Sending request to generate summary...");

      // Use GET method (no need to specify method or headers)
      const response = await fetch(
        `http://127.0.0.1:8000/generate-summary?fire_id=${point.id}`,
      );

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
        <Map
          center={center}
          points={fires}
          radius={50}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      <ResponderSummarySidebar
        isOpen={showSummarySidebar}
        onClose={() => setShowSummarySidebar(false)}
        summaries={summaryData}
      />
    </main>
  );
}
