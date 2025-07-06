'use client';

import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 overflow-hidden fixed inset-0">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#ffdbbb] mb-2 font-(family-name:--font-eb-garamond)">
            About Us
          </h1>
          <p className="text-gray-400 font-(family-name:--font-eb-garamond)">
            Protecting Communities, Saving Lives
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
          <div className="space-y-4">
            <p className="text-[#ffdbbb] font-(family-name:--font-eb-garamond) text-lg">
              Notifire is a comprehensive fire safety management system designed to
              protect communities and save lives.
            </p>
            
            <p className="text-[#ffdbbb] font-(family-name:--font-eb-garamond) text-lg">
              Our mission is to provide cutting-edge technology solutions for fire
              departments and emergency responders.
            </p>
            
            <p className="text-[#ffdbbb] font-(family-name:--font-eb-garamond) text-lg">
              With real-time monitoring and advanced analytics, we help make
              informed decisions when every second counts.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#ffdbbb] font-(family-name:--font-eb-garamond)">
              Key Features
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[#ffdbbb] font-(family-name:--font-eb-garamond)">
              <li>Real-time emergency response coordination</li>
              <li>Advanced mapping and location services</li>
              <li>Integrated communication systems</li>
              <li>Resource management and tracking</li>
              <li>Data analytics and reporting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}