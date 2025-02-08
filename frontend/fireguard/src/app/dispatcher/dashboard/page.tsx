"use client";

import React, { useState, useEffect } from "react";
import Map from "@/app/components/map";
import Sidebar from "@/app/components/sidebar";

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

interface FireData {
    id: string;
    latitude: number;
    longitude: number;
    confidence: number;
}

export default function DispatcherDashboard() {
    const center: [number, number] = [34.0522, -118.2437]; // Los Angeles coordinates
    const [fireData, setFireData] = useState<MapPoint[]>([]);
    
    // Sidebar state
    const [selectedMarker, setSelectedMarker] = useState<MapPoint | null>(null);
    const [showSidebar, setShowSidebar] = useState(false);

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
                        severity: fire.confidence >= 80 
                            ? "high" 
                            : fire.confidence >= 50 
                            ? "medium" 
                            : "low"
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

    const handleMarkerClick = (point: MapPoint) => {
        console.log("Marker clicked:", point);
        setSelectedMarker(point);
        setShowSidebar(true);
    };

    return (
        <main className="fixed inset-0 w-full h-full">
            {/* Full-screen map container */}
            <div className="absolute inset-0 w-full h-full">
                <Map
                    center={center}
                    points={fireData}
                    radius={50}
                    onMarkerClick={handleMarkerClick}
                />
            </div>

            {/* Sidebar for Fire Details */}
            <Sidebar
                isOpen={showSidebar}
                onClose={() => setShowSidebar(false)}
                side="left"
            >
                <div className="h-full p-6 text-[#ffdbbb]">
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
                        </>
                    ) : (
                        <p>No marker selected</p>
                    )}
                </div>
            </Sidebar>
        </main>
    );
}
