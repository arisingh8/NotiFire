'use client';

import React, { useState } from 'react';
import Input from '@/app/components/form/input';
import Select from '@/app/components/form/select';
import Textarea from '@/app/components/form/textarea';
import Map from '@/app/components/map';

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

export default function TestPage() {
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    details: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sample map data
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

  const stateOptions = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' }
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Simple validation
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.details) newErrors.details = 'Details are required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form submitted:', formData);
  };

  const handleMarkerClick = (point: MapPoint) => {
    console.log('Marker clicked:', point);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Form Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl text-[#ffdbbb] mb-6 font-[family-name:var(--font-eb-garamond)]">
            Test Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your name"
            />

            <Select
              label="State"
              name="state"
              required
              options={stateOptions}
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
              placeholder="Select your state"
            />

            <Textarea
              label="Details"
              name="details"
              required
              value={formData.details}
              onChange={handleChange}
              error={errors.details}
              placeholder="Enter additional details"
              maxLength={500}
              showCharacterCount
            />

            <button
              type="submit"
              className="bg-[#ffdbbb] text-gray-900 px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-[family-name:var(--font-eb-garamond)]"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl text-[#ffdbbb] mb-6 font-[family-name:var(--font-eb-garamond)]">
            Test Map
          </h2>
          <div className="h-[500px]">
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
  );
}