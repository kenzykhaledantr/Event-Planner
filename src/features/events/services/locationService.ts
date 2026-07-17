import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';

export interface DeviceLocationResult {
  latitude: number;
  longitude: number;
  address: string;
}

export const locationService = {
  async getCurrentLocation(): Promise<DeviceLocationResult> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('LOCATION_PERMISSION_DENIED');
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const [place] = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    const address = place
      ? [place.name, place.street, place.city, place.region]
          .filter(Boolean)
          .join(', ')
      : `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      address,
    };
  },

  openInMaps(latitude: number, longitude: number, label: string): void {
    const encodedLabel = encodeURIComponent(label);
    const url = Platform.select({
      ios: `maps:0,0?q=${encodedLabel}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${encodedLabel})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });

    Linking.openURL(url!).catch(() => {
      // Fallback if the native maps app isn't available (rare, but real on some Android builds).
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    });
  },
};