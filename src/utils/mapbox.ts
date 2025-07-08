import { GeocodingCore } from "@mapbox/search-js-core";

// Utility functions for Mapbox geocoding using Search JS Core
export interface GeocodeResult {
  longitude: number;
  latitude: number;
  place_name: string;
}

let geocodingCore: GeocodingCore | null = null;

function getGeocodingCore(): GeocodingCore | null {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!geocodingCore) {
    geocodingCore = new GeocodingCore({ accessToken });
  }

  return geocodingCore;
}

export async function geocodeAddress(
  address: string,
): Promise<GeocodeResult | null> {
  const core = getGeocodingCore();

  if (!core) {
    return null;
  }

  try {
    const response = await core.forward(address, {
      limit: 1,
      country: "US",
    });

    if (response.features && response.features.length > 0) {
      const feature = response.features[0];
      const [longitude, latitude] = feature.geometry.coordinates;

      return {
        longitude,
        latitude,
        place_name: feature.properties.full_address,
      };
    }

    return null;
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
}

export function formatAddressForGeocoding(
  street: string,
  city: string,
  state: string,
  zipcode: string,
): string {
  const parts = [street, city, state, zipcode].filter(Boolean);
  return parts.join(", ");
}
