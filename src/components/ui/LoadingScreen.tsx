import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      

      <Text style={styles.title}>Coming Soon</Text>

      <Text style={styles.description}>
        This feature is currently under development and will be available in a
        future update.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 24,
    maxWidth: 320,
  },
});