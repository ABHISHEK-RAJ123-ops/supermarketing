import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

export default function OrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableOrders();
  }, []);

  const fetchAvailableOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders/delivery/available`);
      setOrders(data);
    } catch (error) {
      console.log('Error fetching orders', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Order #{item._id.slice(-6).toUpperCase()}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>New</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Customer Info</Text>
      <Text style={styles.infoText}>Name: {item.customer?.fullName}</Text>
      <Text style={styles.infoText}>Phone: {item.phone}</Text>
      <Text style={styles.infoText}>Branch: {item.branch}</Text>
      <Text style={styles.infoText}>Address: {item.deliveryAddress}</Text>
      
      <Text style={styles.sectionLabel}>Items</Text>
      {item.orderItems.map((prod: any, idx: number) => (
        <View key={idx} style={styles.itemRow}>
          <Text style={styles.itemName}>{prod.qty}x {prod.name}</Text>
          <Text style={styles.itemPrice}>${(prod.price * prod.qty).toFixed(2)}</Text>
        </View>
      ))}

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items Total:</Text>
          <Text style={styles.summaryValue}>${item.itemsPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee:</Text>
          <Text style={styles.summaryValue}>${item.deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Grand Total:</Text>
          <Text style={styles.summaryValueGrand}>${item.grandTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Payment:</Text>
          <Text style={styles.summaryValue}>{item.paymentMethod}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.acceptBtn} 
        onPress={() => router.push(`/(delivery)/actions/${item._id}`)}
      >
        <Text style={styles.acceptBtnText}>Accept & Proceed</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 50 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No remaining orders available.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContainer: { padding: SIZES.large },
  orderCard: { backgroundColor: COLORS.surface, padding: SIZES.large, borderRadius: SIZES.radius, marginBottom: SIZES.large, ...SHADOWS.medium },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.medium },
  orderId: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary },
  badge: { backgroundColor: COLORS.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: COLORS.surface, fontSize: SIZES.font - 2, fontWeight: 'bold' },
  sectionLabel: { fontSize: SIZES.font, fontWeight: '600', color: COLORS.textLight, marginTop: SIZES.small, marginBottom: 4 },
  infoText: { fontSize: SIZES.font, color: COLORS.text, marginBottom: 2 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemName: { fontSize: SIZES.font, color: COLORS.primary },
  itemPrice: { fontSize: SIZES.font, fontWeight: '600', color: COLORS.primary },
  summaryBox: { backgroundColor: COLORS.background, padding: SIZES.medium, borderRadius: SIZES.radius, marginTop: SIZES.medium, marginBottom: SIZES.medium },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { fontSize: SIZES.font, color: COLORS.textLight },
  summaryValue: { fontSize: SIZES.font, fontWeight: '600', color: COLORS.primary },
  summaryValueGrand: { fontSize: SIZES.medium, fontWeight: '800', color: COLORS.accentDark },
  acceptBtn: { backgroundColor: COLORS.accent, padding: SIZES.medium, borderRadius: SIZES.radius, alignItems: 'center', ...SHADOWS.light },
  acceptBtnText: { color: COLORS.surface, fontSize: SIZES.medium, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: SIZES.font, color: COLORS.textLight },
});
