"use client";

import React, { useState, useEffect } from 'react';
import Map from '@/app/components/map';
import Sidebar from '@/app/components/sidebar';
//import { useRouter } from 'next/navigation';

// Define the MapPoint type to match the one in Map component
interface MapPoint {
    id: string;
    lat: number;
    lng: number;
    type: 'fire' | 'unit' | 'resident';
    details?: {
        title: string;
        description: string;
        severity?: 'low' | 'medium' | 'high';
    };
}

interface FireData {
    id: string;
    latitude: number;
    longitude: number;
    confidence: number;
  }

export default function ResidentDashboard() {
    const center: [number, number] = [34.0522, -118.2437]; // Los Angeles coordinates
    const [showAlerts, setShowAlerts] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showContacts, setShowContacts] = useState(false);
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
        console.log('Marker clicked:', point);
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

            {/* Sidebars */}
            <Sidebar 
                isOpen={showAlerts} 
                onClose={() => setShowAlerts(false)}
                side="right"
            >
                <div className="h-full bg-gray-800 p-6 text-[#ffdbbb]">
                    <h3 className="text-red-400 font-bold mb-4">Active Alerts</h3>
                    <div className="p-4 bg-red-900/20 rounded-lg">
                        <h4 className="text-red-400 font-bold mb-2">High Priority</h4>
                        <p className="font-(family-name:--font-eb-garamond)">
                            Active fire reported in your area. Please stay alert and follow evacuation orders if issued.
                        </p>
                    </div>
                </div>
            </Sidebar>

            <Sidebar 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)}
                side="right"
            >
                <div className="h-full bg-gray-800 p-6 text-[#ffdbbb]">
                    <h3 className="font-bold mb-4">Recent Notifications</h3>
                    <div className="font-(family-name:--font-eb-garamond)">
                        <p className="mb-2"><span className="font-bold">2:15 PM:</span> New fire unit deployed to your area</p>
                        <p className="mb-2"><span className="font-bold">1:30 PM:</span> Weather warning: High winds expected</p>
                        <p><span className="font-bold">12:45 PM:</span> Daily fire risk assessment updated</p>
                    </div>
                </div>
            </Sidebar>

            <Sidebar 
                isOpen={showContacts} 
                onClose={() => setShowContacts(false)}
                side="right"
            >
                <div className="h-full bg-gray-800 p-6 text-[#ffdbbb]">
                    <h3 className="font-bold mb-4">Emergency Contacts</h3>
                    <div className="font-(family-name:--font-eb-garamond)">
                        <p className="mb-2">Emergency: 911</p>
                        <p className="mb-2">Local Fire Department: (555) 123-4567</p>
                        <p>Community Emergency Line: (555) 987-6543</p>
                    </div>
                </div>
            </Sidebar>

            {/* Control buttons */}
            <div className="absolute top-4 right-4 space-x-4 z-50">
                <button
                    onClick={() => setShowAlerts(!showAlerts)}
                    className="px-4 py-2 bg-red-600/90 text-white rounded hover:bg-red-700 backdrop-blur-sm"
                >
                    Alerts
                </button>
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="px-4 py-2 bg-blue-600/90 text-white rounded hover:bg-blue-700 backdrop-blur-sm"
                >
                    Notifications
                </button>
                <button
                    onClick={() => setShowContacts(!showContacts)}
                    className="px-4 py-2 bg-green-600/90 text-white rounded hover:bg-green-700 backdrop-blur-sm"
                >
                    Contacts
                </button>
            </div>
        </main>
    );
}