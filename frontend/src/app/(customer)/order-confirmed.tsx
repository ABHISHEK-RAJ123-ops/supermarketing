import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function OrderConfirmed() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders/${orderId}`);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Order details not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.successHeader}>
          <Text style={styles.tickIcon}>✅</Text>
          <Text style={styles.title}>Order Placed!</Text>
          <Text style={styles.message}>
            Your order <Text style={{ fontWeight: 'bold' }}>{order._id}</Text> has been placed successfully!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <Text style={styles.detailValue}>{order._id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Branch:</Text>
            <Text style={styles.detailValue}>{order.branch}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, { color: COLORS.accentDark }]}>{order.status}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Grand Total:</Text>
            <Text style={[styles.detailValue, { fontSize: 18, color: COLORS.primary }]}>
              ${order.grandTotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery Address:</Text>
            <Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]}>{order.deliveryAddress}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          {order.orderItems.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.qty}x {item.name}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.trackBtn} 
          onPress={() => router.push({ pathname: '/(customer)/order-tracking', params: { orderId: order._id } })}
        >
          <Text style={styles.trackBtnText}>Track My Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.continueBtn} 
          onPress={() => router.replace('/(customer)/dashboard')}
        >
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SIZES.large, paddingBottom: 150 },
  successHeader: { alignItems: 'center', marginBottom: SIZES.extraLarge, marginTop: 40 },
  tickIcon: { fontSize: 80, marginBottom: SIZES.small },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginBottom: 8 },
  message: { fontSize: SIZES.font, color: COLORS.textLight, textAlign: 'center', paddingHorizontal: SIZES.large },
  card: { backgroundColor: COLORS.surface, padding: SIZES.large, borderRadius: SIZES.radius, marginBottom: SIZES.large, ...SHADOWS.light },
  sectionTitle: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary, marginBottom: SIZES.medium },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: SIZES.font, color: COLORS.textLight },
  detailValue: { fontSize: SIZES.font, fontWeight: '600', color: COLORS.text },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemName: { fontSize: SIZES.font, color: COLORS.primary },
  itemPrice: { fontSize: SIZES.font, fontWeight: '600', color: COLORS.primary },
  errorText: { fontSize: SIZES.medium, color: COLORS.error },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.surface, padding: SIZES.large, borderTopLeftRadius: SIZES.extraLarge, borderTopRightRadius: SIZES.extraLarge, ...SHADOWS.medium },
  trackBtn: { backgroundColor: COLORS.primary, padding: SIZES.medium, borderRadius: SIZES.radius, alignItems: 'center', marginBottom: SIZES.small },
  trackBtnText: { color: COLORS.surface, fontSize: SIZES.medium, fontWeight: 'bold' },
  continueBtn: { backgroundColor: COLORS.background, padding: SIZES.medium, borderRadius: SIZES.radius, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary },
  continueBtnText: { color: COLORS.primary, fontSize: SIZES.medium, fontWeight: 'bold' },
});
