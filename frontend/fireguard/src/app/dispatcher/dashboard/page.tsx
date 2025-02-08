"use client";

import React, { useState } from 'react';
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

export default function DispatcherDashboard() {
    const center: [number, number] = [34.0522, -118.2437]; // Los Angeles coordinates
    const samplePoints = [
        {
            id: '1',
            lat: 34.0522,
            lng: -118.2437,
            type: 'fire' as const,
            details: {
                title: 'Active Fire',
                description: 'Large brush fire in downtown area',
                severity: 'high' as const
            }
        },
        {
            id: '2',
            lat: 34.0622,
            lng: -118.2537,
            type: 'unit' as const,
            details: {
                title: 'Fire Unit 7',
                description: 'Responding unit'
            }
        },
        {
            id: '3',
            lat: 34.0422,
            lng: -118.2337,
            type: 'resident' as const,
            details: {
                title: 'Residential Area',
                description: 'High-density housing'
            }
        }
    ];

    const [showAlerts, setShowAlerts] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showContacts, setShowContacts] = useState(false);

    const handleMarkerClick = (point: MapPoint) => {
        console.log('Marker clicked:', point);
    };

    return (
        <main className="fixed inset-0 w-full h-full">
            {/* Full-screen map container */}
            <div className="absolute inset-0 w-full h-full">
                <Map
                    center={center}
                    points={samplePoints}
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
                        <p className="font-[family-name:var(--font-eb-garamond)]">
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
                    <div className="font-[family-name:var(--font-eb-garamond)]">
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
                    <div className="font-[family-name:var(--font-eb-garamond)]">
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