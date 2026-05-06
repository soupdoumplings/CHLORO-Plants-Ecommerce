import React, { useCallback, useMemo, useState } from 'react';
import { GeoLocationContext } from './geoLocationContext';

const LOCATION_CACHE_KEY = 'chloro_user_location';
const LOCATION_CACHE_VERSION = 2;

const getCachedLocation = () => {
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    return parsed.version === LOCATION_CACHE_VERSION ? parsed : null;
  } catch (err) {
    console.error('Unable to read cached location:', err);
    return null;
  }
};

const cacheLocation = (location) => {
  try {
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location));
  } catch (err) {
    console.error('Unable to cache location:', err);
  }
};

const clearCachedLocation = () => {
  try {
    localStorage.removeItem(LOCATION_CACHE_KEY);
  } catch (err) {
    console.error('Unable to clear cached location:', err);
  }
};

const getPosition = () => (
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 1000 * 60 * 15,
    });
  })
);

const reverseGeocodeWithNominatim = async ({ latitude, longitude }) => {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: '1',
    zoom: '18',
    'accept-language': 'en',
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en',
    },
  });

  if (!response.ok) {
    throw new Error('Detailed reverse geocoding failed.');
  }

  return response.json();
};

const reverseGeocodeWithBigDataCloud = async ({ latitude, longitude }) => {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: 'en',
  });

  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Unable to resolve your address from coordinates.');
  }

  return response.json();
};

const reverseGeocode = async (coordinates) => {
  try {
    const place = await reverseGeocodeWithNominatim(coordinates);
    return { provider: 'nominatim', place };
  } catch (err) {
    console.error('Detailed geocoding failed, using fallback:', err);
    const place = await reverseGeocodeWithBigDataCloud(coordinates);
    return { provider: 'bigdatacloud', place };
  }
};

const buildAddress = (place) => {
  if (place?.address) {
    const address = place.address;
    const locality = address.city || address.town || address.village || address.municipality || '';
    const neighbourhood = address.neighbourhood || address.suburb || address.quarter || address.city_district || '';
    const street = [
      address.house_number,
      address.road || address.pedestrian || address.footway || address.path,
    ].filter(Boolean).join(' ');
    const addressLine = [
      street,
      neighbourhood,
      locality,
      address.state || address.region,
      address.country,
    ].filter(Boolean).join(', ');

    return {
      addressLine: addressLine || place.display_name || '',
      city: locality || address.county || address.state || '',
      postalCode: address.postcode || '',
      country: address.country || '',
      neighbourhood,
      fullAddress: place.display_name || addressLine,
    };
  }

  const lineParts = [
    place.localityInfo?.informative?.[0]?.name,
    place.locality,
    place.principalSubdivision,
    place.countryName,
  ].filter(Boolean);

  return {
    addressLine: lineParts.join(', '),
    city: place.city || place.locality || place.principalSubdivision || '',
    postalCode: place.postcode || '',
    country: place.countryName || '',
    neighbourhood: place.localityInfo?.informative?.[0]?.name || '',
    fullAddress: place.localityInfo?.informative?.[0]?.name || lineParts.join(', '),
  };
};

export const GeoLocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => getCachedLocation());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestLocation = useCallback(async () => {
    setError('');
    setLoading(true);

    try {
      const position = await getPosition();
      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      const geocodeResult = await reverseGeocode(coordinates);
      const nextLocation = {
        version: LOCATION_CACHE_VERSION,
        coordinates,
        address: buildAddress(geocodeResult.place),
        source: `browser-geolocation:${geocodeResult.provider}`,
        capturedAt: new Date().toISOString(),
      };

      setLocation(nextLocation);
      cacheLocation(nextLocation);
      return { success: true, location: nextLocation };
    } catch (err) {
      const message = err?.code === 1
        ? 'Location permission was denied.'
        : err?.message || 'Unable to detect your location.';

      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    clearCachedLocation();
    setLocation(null);
    setError('');
  }, []);

  const value = useMemo(() => ({
    location,
    loading,
    error,
    isSupported: typeof navigator !== 'undefined' && Boolean(navigator.geolocation),
    requestLocation,
    clearLocation,
  }), [location, loading, error, requestLocation, clearLocation]);

  return (
    <GeoLocationContext.Provider value={value}>
      {children}
    </GeoLocationContext.Provider>
  );
};
