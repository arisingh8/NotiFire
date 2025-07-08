"use client";

import React, { use, useState } from "react";
import Map, { MapPoint } from "@/app/components/map";
import Sidebar from "@/app/components/sidebar";
import Button from "@/app/components/button"; // Adjust the path if necessary
import { convertDistance, getDistance } from "geolib";
import { createClient } from "@/utils/supabase/client";
import { FirstResponder } from "@/app/dashboard/page";

export default function DispatcherDashboard({
  formattedFires,
  allResponders,
  center,
}: {
  formattedFires: Promise<MapPoint[]>;
  allResponders: Promise<FirstResponder[]>;
  center: [number, number];
}) {
  const [selectedMarker, setSelectedMarker] = useState<MapPoint | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [nearbyResponders, setNearbyResponders] = useState<FirstResponder[]>(
    [],
  );
  const fires = use(formattedFires);
  const responders = use(allResponders);

  const handleMarkerClick = async (point: MapPoint) => {
    console.log("Marker clicked:", point);
    setSelectedMarker(point);
    setShowSidebar(true);

    const respondersWithDistances = responders.map((responder) => {
      return {
        ...responder,
        distance:
          responder.lat && responder.lng
            ? Math.round(
                convertDistance(
                  getDistance(
                    { latitude: responder.lat, longitude: responder.lng },
                    { latitude: point.lat, longitude: point.lng },
                  ),
                  "mi",
                ),
              )
            : Infinity,
      };
    });

    const nearbyResponders = respondersWithDistances.filter((responder) => {
      return responder.distance <= 100;
    });
    console.log("Nearby responders:", nearbyResponders);
    setNearbyResponders(nearbyResponders);
  };

  const handleDispatch = async (fire_id: string, responder_id: string) => {
    try {
      console.log(`Dispatching responder: ${responder_id} to fire: ${fire_id}`);

      const supabase = createClient();
      const { error } = await supabase.from("dispatches").insert({
        fire_id: fire_id,
        responder_id: responder_id,
      });
      if (error) {
        throw new Error(
          `Failed to dispatch responder. Status: ${error.message}`,
        );
      }

      console.log(`Responder ${responder_id} dispatched successfully.`);
    } catch (error) {
      console.error("Error dispatching responder:", error);
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

      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        side="left"
      >
        <div className="h-full bg-gray-800 p-6 text-[#ffdbbb]">
          {selectedMarker ? (
            <>
              <h3 className="text-red-400 font-bold mb-4">
                {selectedMarker.details?.title}
              </h3>
              <p>{selectedMarker.details?.description}</p>
              <p className="mt-2">
                Severity:{" "}
                <span className="font-bold text-red-500">
                  {selectedMarker.details?.severity}
                </span>
              </p>

              <h4 className="text-yellow-300 font-bold mt-4">
                Nearby Responders
              </h4>
              {nearbyResponders.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {nearbyResponders.map((responder, index) => (
                    <li
                      key={`${responder.unit_name}-${index}`}
                      className="p-3 bg-gray-700 rounded flex flex-col"
                    >
                      <div>
                        <span className="font-bold">{responder.unit_name}</span>
                        <p className="text-sm">
                          Role: {responder.role || "N/A"}
                        </p>
                        <p className="text-sm">
                          Distance: {responder.distance} miles
                        </p>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="primary"
                          size="medium"
                          onClick={() =>
                            handleDispatch(selectedMarker.id, responder.user_id)
                          }
                        >
                          Dispatch
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm mt-2">
                  No responders nearby.
                </p>
              )}
            </>
          ) : (
            <p>No marker selected</p>
          )}
        </div>
      </Sidebar>
    </main>
  );
}
