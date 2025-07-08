"use client";

import React, { use, useState } from "react";
import Map from "@/app/components/map";
import ResponderSummarySidebar from "@/app/components/sidebar/ResponderSummarySidebar";
import { MapPoint } from "@/app/components/map";
import { Resident } from "./page";
import { convertDistance, getDistance } from "geolib";
import { generateSummary } from "./actions";

interface SummaryData {
  firefighter: string;
  emt: string;
  police: string;
}

export default function FirstResponderDashboard({
  formattedFires,
  center,
  allResidents,
}: {
  formattedFires: Promise<MapPoint[]>;
  center: [number, number];
  allResidents: Promise<Resident[]>;
}) {
  const [showSummarySidebar, setShowSummarySidebar] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const fires = use(formattedFires);
  const residents = use(allResidents);
  const handleMarkerClick = async (point: MapPoint) => {
    console.log("🔥 Marker clicked:", point);

    try {
      const residentsWithDistances = residents.map((resident) => {
        return {
          ...resident,
          distance:
            resident.lat && resident.lng
              ? Math.round(
                  convertDistance(
                    getDistance(
                      { latitude: resident.lat, longitude: resident.lng },
                      { latitude: point.lat, longitude: point.lng },
                    ),
                    "mi",
                  ),
                )
              : Infinity,
        };
      });
  
      const nearbyResidents = residentsWithDistances.filter((resident) => {
        return resident.distance <= 20;
      });
      console.log(nearbyResidents);

      if (nearbyResidents.length === 0) {
        setSummaryData({
          firefighter: "No residents nearby",
          emt: "No residents nearby",
          police: "No residents nearby"
        });
        setShowSummarySidebar(true);
        return;
      }

      console.log("📩 Sending request to generate summary...");
      
      const summary = await generateSummary(nearbyResidents);

      console.log("✅ Summary generated:", summary);

      setSummaryData(summary ?? {
        firefighter: "No summary available",
        emt: "No summary available",
        police: "No summary available"
      });
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
