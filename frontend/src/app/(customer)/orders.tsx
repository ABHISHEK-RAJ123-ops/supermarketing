import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { AuthContext, API_URL } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function CustomerOrders() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refresh orders every time the screen is focused by refetching on mount
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders/customer/${user._id}`);
      setOrders(data);
    } catch (error) {
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Delivered') return '#4CAF50';
    if (status === 'Cancelled') return COLORS.error;
    if (status === 'Placed') return COLORS.primary;
    return COLORS.accent;
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have no orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.orderCard}
              onPress={() => router.push(`/(customer)/order-tracking?orderId=${item._id}`)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order ID: {item._id.slice(-6).toUpperCase()}</Text>
                <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20', color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.detailText}>Branch: {item.branch}</Text>
                <Text style={styles.detailText}>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Items: {item.orderItems?.length || 0}</Text>
                <Text style={styles.grandTotal}>Total: ${item.grandTotal?.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { padding: SIZES.large },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: SIZES.large, color: COLORS.textLight },
  orderCard: { 
    backgroundColor: COLORS.surface, 
    padding: SIZES.large, 
    borderRadius: SIZES.radius, 
    marginBottom: SIZES.medium, 
    ...SHADOWS.light 
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.small },
  orderId: { fontSize: SIZES.font, fontWeight: 'bold', color: COLORS.primary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  orderDetails: { marginTop: SIZES.small },
  detailText: { fontSize: SIZES.font, color: COLORS.textLight, marginBottom: 4 },
  grandTotal: { fontSize: SIZES.large, fontWeight: '800', color: COLORS.accentDark, marginTop: SIZES.small }
});
