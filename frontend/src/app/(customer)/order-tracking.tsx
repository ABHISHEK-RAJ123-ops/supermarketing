import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const SOCKET_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

const STATUS_STEPS = ['Placed', 'Preparing', 'Out For Delivery', 'Delivered'];

export default function OrderTracking() {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState({
    latitude: 9.9312, // Dummy coordinates (Kochi)
    longitude: 76.2673,
  });

  const mapRef = useRef<MapView | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetchOrder();

    // Setup Socket.IO
    socketRef.current = io(SOCKET_URL);
    socketRef.current?.emit('join_order_room', orderId);

    socketRef.current?.on('order_status_update', (updatedOrder: any) => {
      setOrder(updatedOrder);
    });

    socketRef.current?.on('location_update', (data: any) => {
      setDeliveryLocation({ latitude: data.latitude, longitude: data.longitude });
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: data.latitude,
          longitude: data.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders/${orderId}`);
      setOrder(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: async () => {
        try {
          const { data } = await axios.put(`${API_URL}/orders/${orderId}/cancel`);
          setOrder(data);
          Alert.alert('Success', 'Order cancelled successfully.');
        } catch (error: any) {
          Alert.alert('Error', error.response?.data?.message || 'Failed to cancel order');
        }
      }}
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 50 }} />;
  }

  if (!order) return <Text style={styles.errorText}>Order not found.</Text>;

  const currentStatusIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <View style={styles.container}>
      {/* Live Map Tracking */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: deliveryLocation.latitude,
            longitude: deliveryLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker 
            coordinate={deliveryLocation} 
            title="Delivery Boy" 
            description="On the way"
            pinColor={COLORS.accent}
          />
          {/* Simulated Supermarket Location */}
          <Marker 
            coordinate={{ latitude: 9.9350, longitude: 76.2600 }} 
            title="A-Z Supermarket" 
            pinColor={COLORS.primary}
          />
        </MapView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.card}>
          <Text style={styles.orderIdText}>Order ID: {order._id}</Text>
          <Text style={styles.summaryText}>Branch: {order.branch}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.timelineContainer}>
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isActive = index === currentStatusIndex;
              return (
                <View key={step} style={styles.timelineStepRow}>
                  <View style={styles.timelineIndicator}>
                    <View style={[styles.dot, isCompleted && styles.dotCompleted, isActive && styles.dotActive]} />
                    {index !== STATUS_STEPS.length - 1 && (
                      <View style={[styles.line, isCompleted && styles.lineCompleted]} />
                    )}
                  </View>
                  <Text style={[styles.timelineText, isCompleted && styles.timelineTextCompleted, isActive && styles.timelineTextActive]}>
                    {step}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {order.orderItems?.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.qty}x {item.name}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <Text style={styles.summaryText}>Items Total: ${order.itemsPrice.toFixed(2)}</Text>
          <Text style={styles.summaryText}>Delivery Fee: ${order.deliveryFee.toFixed(2)}</Text>
          <View style={styles.divider} />
          <Text style={styles.grandTotalText}>Grand Total: ${order.grandTotal.toFixed(2)}</Text>
        </View>

        {order.status === 'Placed' && (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelOrder}>
            <Text style={styles.cancelBtnText}>Cancel Order</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapContainer: { height: 300, width: '100%', borderBottomWidth: 1, borderColor: COLORS.border },
  map: { ...StyleSheet.absoluteFillObject },
  scrollContent: { padding: SIZES.large },
  card: { backgroundColor: COLORS.surface, padding: SIZES.large, borderRadius: SIZES.radius, marginBottom: SIZES.medium, ...SHADOWS.light },
  orderIdText: { fontSize: SIZES.font, fontWeight: 'bold', color: COLORS.primary },
  sectionTitle: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary, marginBottom: SIZES.medium },
  timelineContainer: { paddingLeft: 10 },
  timelineStepRow: { flexDirection: 'row', alignItems: 'flex-start' },
  timelineIndicator: { alignItems: 'center', marginRight: SIZES.medium, width: 20 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.border, zIndex: 2 },
  dotCompleted: { backgroundColor: COLORS.accent },
  dotActive: { width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: COLORS.accentDark },
  line: { width: 2, height: 40, backgroundColor: COLORS.border, position: 'absolute', top: 14, zIndex: 1 },
  lineCompleted: { backgroundColor: COLORS.accent },
  timelineText: { fontSize: SIZES.medium, color: COLORS.textLight, marginTop: -2, paddingBottom: 30 },
  timelineTextCompleted: { color: COLORS.text },
  timelineTextActive: { fontWeight: 'bold', color: COLORS.primary },
  summaryText: { fontSize: SIZES.font, color: COLORS.text, marginBottom: 8 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  grandTotalText: { fontSize: SIZES.large, fontWeight: '800', color: COLORS.accentDark },
  errorText: { textAlign: 'center', marginTop: 50, color: COLORS.error },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemName: { fontSize: SIZES.font, color: COLORS.text },
  itemPrice: { fontSize: SIZES.font, color: COLORS.text, fontWeight: '600' },
  cancelBtn: { backgroundColor: COLORS.error + '10', padding: SIZES.medium, borderRadius: SIZES.radius, alignItems: 'center', marginTop: SIZES.medium, borderWidth: 1, borderColor: COLORS.error },
  cancelBtnText: { color: COLORS.error, fontWeight: 'bold', fontSize: SIZES.font }
});
