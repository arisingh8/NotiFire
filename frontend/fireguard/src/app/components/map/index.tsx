'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapStyles } from './styles';

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
}) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert miles to meters for the circle radius
  const radiusInMeters = radius * 1609.34;

  // Define world bounds that exclude the poles
  const worldBounds = L.latLngBounds(
    L.latLng(-85, -180), // South West (adjusted to avoid Antarctic)
    L.latLng(85, 180)    // North East (adjusted to avoid Arctic)
  );

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Function to create custom icons dynamically
  const createCustomIcon = (type: MapPoint['type'], severity?: string) => {
    const color =
      type === 'fire'
        ? severity === 'high'
          ? '#ef4444'
          : severity === 'medium'
          ? '#f97316'
          : '#eab308'
        : type === 'unit'
        ? '#3b82f6'
        : '#22c55e';

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    });
  };

  if (!isLoaded) return <div className={MapStyles.loading}>Loading map...</div>;

  return (
    <div className={MapStyles.container}>
      <MapContainer 
        center={center} 
        zoom={10} 
        className={MapStyles.map}
        ref={mapRef}
        minZoom={3}     // Increased to prevent seeing gray areas
        maxZoom={18}
        maxBounds={worldBounds}
        maxBoundsViscosity={1.0}
      >
        <ChangeView center={center} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
          bounds={worldBounds}
        />

        {/* Radius Circle */}
        <Circle
          center={center}
          radius={radiusInMeters}
          pathOptions={{
            color: '#ffdbbb',
            fillColor: '#ffdbbb',
            fillOpacity: 0.1,
          }}
        />

        {/* Map Points */}
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={createCustomIcon(point.type, point.details?.severity)}
            eventHandlers={{
              click: () => onMarkerClick?.(point),
            }}
          >
            {point.details && (
              <Popup>
                <div>
                  <h3 style={{ margin: '0', fontWeight: 'bold' }}>{point.details.title}</h3>
                  <p style={{ margin: '5px 0' }}>{point.details.description}</p>
                  {point.details.severity && (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        borderRadius: '5px',
                        backgroundColor:
                          point.details.severity === 'high' ? '#ef4444' :
                          point.details.severity === 'medium' ? '#f97316' :
                          '#eab308',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
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
