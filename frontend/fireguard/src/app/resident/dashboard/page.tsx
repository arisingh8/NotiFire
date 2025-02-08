"use client";

import React from 'react';
//import { useRouter } from 'next/navigation';
import Collapser from '@/app/components/collapser';
import Map from '@/app/components/map';

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

export default function ResidentDashboard() {
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
          Dashboard
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

          <div className="space-y-4">
            <Collapser title="Active Alerts">
              <div className="space-y-4">
                <div className="p-4 bg-red-900/20 rounded-lg">
                  <h3 className="text-red-400 font-bold mb-2">High Priority</h3>
                  <p className="text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]">
                    Active fire reported in your area. Please stay alert and follow evacuation orders if issued.
                  </p>
                </div>
              </div>
            </Collapser>

            <Collapser title="Recent Notifications">
              <div className="space-y-4">
                <div className="text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]">
                  <p className="mb-2">
                    <span className="font-bold">2:15 PM:</span> New fire unit deployed to your area
                  </p>
                  <p className="mb-2">
                    <span className="font-bold">1:30 PM:</span> Weather warning: High winds expected
                  </p>
                  <p>
                    <span className="font-bold">12:45 PM:</span> Daily fire risk assessment updated
                  </p>
                </div>
              </div>
            </Collapser>

            <Collapser title="Emergency Contacts">
              <div className="space-y-4">
                <div className="text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]">
                  <p className="mb-2">Emergency: 911</p>
                  <p className="mb-2">Local Fire Department: (555) 123-4567</p>
                  <p>Community Emergency Line: (555) 987-6543</p>
                </div>
              </div>
            </Collapser>
          </div>
        </div>
      </div>
    </div>
  );
}
