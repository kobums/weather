import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

// Default Seoul coordinates for fallback
const DEFAULT_COORDS = {
  latitude: 37.5665,
  longitude: 126.978,
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(() => {
    // Check if geolocation is supported immediately
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return {
        ...DEFAULT_COORDS,
        error: 'Geolocation is not supported - using default location',
        loading: false,
      };
    }
    return {
      latitude: null,
      longitude: null,
      error: null,
      loading: true,
    };
  });

  useEffect(() => {
    // If geolocation is not supported, we already set the error in initial state
    if (!navigator.geolocation) {
      return;
    }

    const timeoutId = setTimeout(() => {
      console.warn('Geolocation timeout - using default location (Seoul)');
      setState({
        ...DEFAULT_COORDS,
        error: 'Geolocation timeout - using default location',
        loading: false,
      });
    }, 5000); // 5 second timeout

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error('Geolocation error:', error.code, error.message);
        // Use default location on any error
        setState({
          ...DEFAULT_COORDS,
          error: `Geolocation error: ${error.message} - using default location`,
          loading: false,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000, // Use cached position if less than 1 minute old
      }
    );

    return () => clearTimeout(timeoutId);
  }, []);

  return state;
}
