"use client";

import React from 'react';
import Map from '@/app/components/map';
import { useRouter } from 'next/navigation';

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

    const handleMarkerClick = (point: MapPoint) => {
        console.log('Marker clicked:', point);
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <h1 className="flex justify-center text-4xl text-[#ffdbbb] mb-6 font-[family-name:var(--font-eb-garamond)]">
                    Dispatcher Dashboard
                </h1>
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h2 className="text-2xl text-[#ffdbbb] mb-6 font-[family-name:var(--font-eb-garamond)]">
                        Live Map
                    </h2>
                    <div className="h-[500px] relative mb-6">
                        <Map
                            center={center}
                            points={samplePoints}
                            radius={50}
                            onMarkerClick={handleMarkerClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}