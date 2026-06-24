/**
 * Web stub for react-native-maps.
 * react-native-maps uses codegenNativeComponent which is not available on web.
 * This mock renders placeholder Views so the app doesn't crash on web.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapView = React.forwardRef(({ style, children }: any, _ref: any) => (
  <View style={[styles.mapPlaceholder, style]}>
    <Text style={styles.mapText}>🗺️ Map (not available on web)</Text>
    {children}
  </View>
));

const Marker = (_props: any) => null;
const Polyline = (_props: any) => null;
const Callout = (_props: any) => null;
const Circle = (_props: any) => null;
const Polygon = (_props: any) => null;

const styles = StyleSheet.create({
  mapPlaceholder: {
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#666',
    fontSize: 16,
  },
});

export default MapView;
export { Marker, Polyline, Callout, Circle, Polygon };
