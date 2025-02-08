'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapStyles } from './styles';
import L from 'leaflet';

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

interface MapProps {
  center: [number, number];
  points?: MapPoint[];
  radius?: number; // in miles
  onMarkerClick?: (point: MapPoint) => void;
  className?: string;
}

// Component to handle map center changes
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

const Map: React.FC<MapProps> = ({
  center,
  points = [],
  radius = 50,
  onMarkerClick,
  className
}) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert miles to meters for the circle radius
  const radiusInMeters = radius * 1609.34;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const createCustomIcon = (type: MapPoint['type'], severity?: string) => {
    const color = type === 'fire' 
      ? (severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f97316' : '#eab308')
      : type === 'unit' 
      ? '#3b82f6' 
      : '#22c55e';

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  if (!isLoaded) return <div className={MapStyles.loading}>Loading map...</div>;

  return (
    <div className={`${MapStyles.container} ${className || ''}`}>
      <MapContainer
        center={center}
        zoom={10}
        className={MapStyles.map}
        ref={mapRef}
      >
        <ChangeView center={center} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Radius Circle */}
        <Circle
          center={center}
          radius={radiusInMeters}
          pathOptions={{ 
            color: '#ffdbbb',
            fillColor: '#ffdbbb',
            fillOpacity: 0.1
          }}
        />

        {/* Map Points */}
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={createCustomIcon(point.type, point.details?.severity)}
            eventHandlers={{
              click: () => onMarkerClick?.(point)
            }}
          >
            {point.details && (
              <Popup>
                <div className={MapStyles.popup}>
                  <h3 className={MapStyles.popupTitle}>{point.details.title}</h3>
                  <p className={MapStyles.popupDescription}>{point.details.description}</p>
                  {point.details.severity && (
                    <span className={`${MapStyles.severity} ${MapStyles[`severity_${point.details.severity}`]}`}>
                      {point.details.severity.toUpperCase()}
                    </span>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;