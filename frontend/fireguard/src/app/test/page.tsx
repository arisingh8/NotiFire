'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/app/components/form/input';
import Select from '@/app/components/form/select';
import Textarea from '@/app/components/form/textarea';
import Map from '@/app/components/map';
import Alert from '@/app/components/alert';
import Layout from '@/app/components/layout';

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
  const [fireData, setFireData] = useState<MapPoint[]>([]);

  // Fetch fire data from the API
  useEffect(() => {
    const fetchFireData = async () => {
      try {
        console.log("Fetching fire data...");
        const response = await fetch("http://127.0.0.1:8000/fires");
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched fire data:", data); // ✅ Log raw API response
  
        const formattedFires = data.map((fire: any) => ({
          id: fire.id,
          lat: fire.latitude,
          lng: fire.longitude,
          type: "fire",
          details: {
            title: `Fire ${fire.id.substring(0, 4)}`,
            description: `Confidence: ${fire.confidence}%`,
            severity:
              fire.confidence >= 80 ? "high" :
              fire.confidence >= 50 ? "medium" : "low",
          },
        }));
  
        console.log("Formatted fire data for map:", formattedFires); // ✅ Log processed data
  
        setFireData(formattedFires);
      } catch (error) {
        console.error("Error fetching fire data:", error);
      }
    };
  
    fetchFireData();
  }, []);
  
  

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

  const sidebarItems = [
    {
      label: 'Dashboard',
      onClick: () => console.log('Dashboard clicked')
    },
    {
      label: 'Fire Alerts',
      items: [
        {
          label: 'Active Fires',
          onClick: () => console.log('Active fires clicked')
        },
        {
          label: 'Historical Data',
          onClick: () => console.log('Historical data clicked')
        }
      ]
    },
    {
      label: 'Units',
      items: [
        {
          label: 'Available Units',
          onClick: () => console.log('Available units clicked')
        },
        {
          label: 'Dispatched Units',
          onClick: () => console.log('Dispatched units clicked')
        }
      ]
    },
    {
      label: 'Settings',
      onClick: () => console.log('Settings clicked')
    }
  ];

  return (
    <Layout sidebarItems={sidebarItems}>
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
          <div className="h-[500px] relative">
          <Map
          center={[34.0522, -118.2437]} // Los Angeles as default center
          points={fireData} // Use fetched fire data
          radius={50} // Pass radius properly
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
    </Layout>
  );
}
