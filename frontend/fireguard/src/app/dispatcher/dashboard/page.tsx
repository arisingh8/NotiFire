"use client";

import React, { useState, useEffect } from "react";
import Map from "@/app/components/map";
import Sidebar from "@/app/components/sidebar";
import Button from "@/app/components/button"; // Adjust the path if necessary

// Define the MapPoint type
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

// Define the FireData type
interface FireData {
    id: string;
    latitude: number;
    longitude: number;
    confidence: number;
}

// Define the FirstResponder type
interface FirstResponder {
    user_id: string;
    role: string;
    unit_name: string;
    distance: number;
}

export default function DispatcherDashboard() {
    const center: [number, number] = [34.0522, -118.2437]; // Los Angeles coordinates
    const [fireData, setFireData] = useState<MapPoint[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<MapPoint | null>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [nearbyResponders, setNearbyResponders] = useState<FirstResponder[]>([]);

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

                const formattedFires = data.map((fire: FireData) => ({
                    id: fire.id,
                    lat: fire.latitude,
                    lng: fire.longitude,
                    type: "fire" as const,
                    details: {
                        title: `Fire ${fire.id.substring(0, 4)}`,
                        description: `Confidence: ${fire.confidence}%`,
                        severity: fire.confidence >= 80 ? "high" : fire.confidence >= 50 ? "medium" : "low"
                    },
                }));

                console.log("Formatted fire data for map:", formattedFires);
                setFireData(formattedFires);
            } catch (error) {
                console.error("Error fetching fire data:", error);
            }
        };

        fetchFireData();
    }, []);

    const handleMarkerClick = async (point: MapPoint) => {
        console.log("Marker clicked:", point);
        setSelectedMarker(point);
        setShowSidebar(true);

        try {
            const response = await fetch(`http://127.0.0.1:8000/responders_within?fire_id=${point.id}&radius_miles=10`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responders = await response.json();
            console.log("Nearby responders:", responders);
            setNearbyResponders(responders);
        } catch (error) {
            console.error("Error fetching responders:", error);
            setNearbyResponders([]);
        }
    };

    const handleDispatch = async (fire_id: string, responder_id: string) => {
        try {
            console.log(`Dispatching responder: ${responder_id}`);
            const response = await fetch("http://127.0.0.1:8000/dispatch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "fire_id": fire_id,
                    "responder_id": responder_id
                })
            });
            if (!response.ok) {
                throw new Error(`Failed to dispatch responder. Status: ${response.status}`);
            }

            console.log(`Responder ${responder_id} dispatched successfully.`);
        } catch (error) {
            console.error("Error dispatching responder:", error);
        }
    };

    return (
        <main className="fixed inset-0 w-full h-full">
            <div className="absolute inset-0 w-full h-full">
                <Map center={center} points={fireData} radius={50} onMarkerClick={handleMarkerClick} />
            </div>

            <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} side="left">
                <div className="h-full bg-gray-800 p-6 text-[#ffdbbb]">
                    {selectedMarker ? (
                        <>
                            <h3 className="text-red-400 font-bold mb-4">{selectedMarker.details?.title}</h3>
                            <p>{selectedMarker.details?.description}</p>
                            <p className="mt-2">
                                Severity: <span className="font-bold text-red-500">{selectedMarker.details?.severity}</span>
                            </p>

                            <h4 className="text-yellow-300 font-bold mt-4">Nearby Responders</h4>
                            {nearbyResponders.length > 0 ? (
                                <ul className="mt-2 space-y-2">
                                    {nearbyResponders.map((responder, index) => (
                                        <li key={`${responder.unit_name}-${index}`} className="p-3 bg-gray-700 rounded flex flex-col">
                                            <div>
                                                <span className="font-bold">{responder.unit_name}</span>
                                                <p className="text-sm">Role: {responder.role || "N/A"}</p>
                                                <p className="text-sm">Distance: {responder.distance} miles</p>
                                            </div>
                                            <div className="mt-2">
                                                <Button
                                                    variant="primary"
                                                    size="medium"
                                                    onClick={() => handleDispatch(selectedMarker.id, responder.user_id)}
                                                >
                                                    Dispatch
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 text-sm mt-2">No responders nearby.</p>
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
