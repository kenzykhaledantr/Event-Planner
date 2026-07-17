import { useState } from 'react';
import { Alert } from 'react-native';
import { locationService } from '../services/locationService';

export function useLocationPicker() {
  const [isFetching, setIsFetching] = useState(false);

  const pickCurrentLocation = async (
    onResolved: (result: { address: string; latitude: number; longitude: number }) => void
  ) => {
    setIsFetching(true);
    try {
      const result = await locationService.getCurrentLocation();
      onResolved(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'LOCATION_PERMISSION_DENIED') {
        Alert.alert(
          'Location Permission Needed',
          'Enable location access in Settings to use your current location.'
        );
      } else {
        Alert.alert('Could not get location', 'Please enter the address manually.');
      }
    } finally {
      setIsFetching(false);
    }
  };

  return { pickCurrentLocation, isFetching };
}