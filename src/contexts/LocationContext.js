import React, { createContext, useContext, useState, useEffect } from 'react';
import { weatherService } from '../services/realTimeServices';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Request user location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await weatherService.getCurrentLocation();
      setUserLocation(location);
      setLocationPermission(location.isDefault ? 'denied' : 'granted');
    } catch (error) {
      console.error('Failed to get location:', error);
      setLocationPermission('denied');
      // Set default location 
      setUserLocation({
        latitude: 28.6139,
        longitude: 77.2090,
        isDefault: true
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const formatLocation = () => {
    if (!userLocation) return 'Loading location...';
    if (userLocation.isDefault) return 'Default Location (New Delhi)';
    return `${userLocation.latitude.toFixed(2)}, ${userLocation.longitude.toFixed(2)}`;
  };

  const value = {
    userLocation,
    locationPermission,
    isLoadingLocation,
    formatLocation,
    requestLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;
