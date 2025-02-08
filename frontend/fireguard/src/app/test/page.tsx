'use client';

import React, { useState } from 'react';
import Input from '@/app/components/form/input';
import Select from '@/app/components/form/select';
import Textarea from '@/app/components/form/textarea';
import Map from '@/app/components/map';
import Alert from '@/app/components/alert';

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

// Create a union type for all possible form events
type FormChangeEvent = 
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | { target: { name: string; value: string; type?: string } };

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

  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <div className="min-h-screen bg-gray-900 p-8 pb-24">
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
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl relative">
          <h2 className="text-2xl text-[#ffdbbb] mb-6 font-[family-name:var(--font-eb-garamond)]">
            Test Map
          </h2>
          <div className="h-[500px] relative">
            <Map
              center={center}
              points={samplePoints}
              radius={50}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl text-[#ffdbbb] mb-6 font-[family-name:var(--font-eb-garamond)]">
            Test Alerts
          </h2>
          <div className="space-y-4">
            <Alert
              title="Emergency Dispatch"
              message="Fire reported at 123 Main St. Multiple units required."
              severity="error"
              actionLabel="Respond"
              onAction={() => console.log('Responded to alert')}
              onRead={() => console.log('Marked as read')}
            />
            
            <Alert
              title="Unit Update"
              message="Unit 7 is en route to the scene."
              severity="info"
              isRead={true}
            />
            
            <Alert
              title="Weather Warning"
              message="High winds expected in the area. Exercise caution."
              severity="warning"
              onDismiss={() => console.log('Alert dismissed')}
            />
            
            <Alert
              title="Mission Complete"
              message="All units have returned to station."
              severity="success"
              isRead={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}