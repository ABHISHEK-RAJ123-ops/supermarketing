import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { AuthContext, API_URL } from '../../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

const STEPS = [
  { id: 'Placed', actionName: 'Accept Order', nextStatus: 'Preparing', desc: 'Confirm you will handle this order and start picking items.' },
  { id: 'Preparing', actionName: 'Order Packed', nextStatus: 'Packed', desc: 'Collect and pack all ordered products from the supermarket shelves.' },
  { id: 'Packed', actionName: 'Mark Out For Delivery', nextStatus: 'Out For Delivery', desc: 'Pick up the packed order. Customer will be notified you are on the way.' },
  { id: 'Out For Delivery', actionName: 'Mark As Delivered', nextStatus: 'Delivered', desc: 'Confirm you have handed the order to the customer.' },
];

export default function DeliveryActions() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.log('Error fetching order', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (nextStatus: string) => {
    setUpdating(true);
    try {
      const { data } = await axios.put(`${API_URL}/orders/${id}/status`, {
        status: nextStatus,
        deliveryBoyId: user._id, // Assign self to order if it's the first step
      });
      setOrder(data);
      
      // If marked as delivered, show success
      if (nextStatus === 'Delivered') {
        Alert.alert('Success!', `Order Delivered. You earned $${data.deliveryFee.toFixed(2)}.`);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 50 }} />;
  if (!order) return <Text style={styles.errorText}>Order not found.</Text>;

  const currentStepIndex = STEPS.findIndex(s => s.id === order.status);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Order Details Header */}
        <View style={styles.card}>
          <Text style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Items:</Text>
            <Text style={styles.detailValue}>{order.orderItems.length} items</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Grand Total:</Text>
            <Text style={styles.detailValue}>${order.grandTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Branch:</Text>
            <Text style={styles.detailValue}>{order.branch}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery Address:</Text>
            <Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]}>{order.deliveryAddress}</Text>
          </View>
        </View>

        {/* Step-wise Actions */}
        <Text style={styles.sectionTitle}>Action Steps</Text>
        
        {STEPS.map((step, index) => {
          // If the order is already Delivered, all are completed.
          const isCompleted = order.status === 'Delivered' || index < currentStepIndex;
          const isActive = index === currentStepIndex && order.status !== 'Delivered';
          
          return (
            <View key={step.id} style={[styles.stepCard, isActive && styles.activeStepCard]}>
              <View style={styles.stepHeader}>
                <View style={[styles.statusIndicator, isCompleted ? styles.completedIndicator : (isActive ? styles.activeIndicator : null)]}>
                  {isCompleted && <Text style={{ color: COLORS.surface }}>✓</Text>}
                </View>
                <Text style={[styles.stepName, isActive && styles.activeStepName]}>{step.actionName}</Text>
              </View>
              
              <Text style={styles.stepDesc}>{step.desc}</Text>

              {isActive && (
                <TouchableOpacity 
                  style={styles.actionBtn} 
                  onPress={() => updateOrderStatus(step.nextStatus)}
                  disabled={updating}
                >
                  {updating ? <ActivityIndicator color={COLORS.surface} /> : <Text style={styles.actionBtnText}>{step.actionName}</Text>}
                </TouchableOpacity>
              )}
            </View>
          );
        })}

      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(delivery)/dashboard')}>
          <Text style={styles.homeBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SIZES.large, paddingBottom: 100 },
  card: { backgroundColor: COLORS.surface, padding: SIZES.large, borderRadius: SIZES.radius, marginBottom: SIZES.large, ...SHADOWS.medium },
  orderId: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary, marginBottom: SIZES.small },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: SIZES.font, color: COLORS.textLight },
  detailValue: { fontSize: SIZES.font, fontWeight: '600', color: COLORS.primary },
  sectionTitle: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary, marginBottom: SIZES.medium },
  stepCard: { backgroundColor: COLORS.surface, padding: SIZES.large, borderRadius: SIZES.radius, marginBottom: SIZES.medium, ...SHADOWS.light, opacity: 0.6 },
  activeStepCard: { opacity: 1, borderColor: COLORS.accent, borderWidth: 2 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.small },
  statusIndicator: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginRight: SIZES.small },
  completedIndicator: { backgroundColor: COLORS.accent },
  activeIndicator: { borderWidth: 2, borderColor: COLORS.accent, backgroundColor: COLORS.surface },
  stepName: { fontSize: SIZES.medium, fontWeight: '600', color: COLORS.textLight },
  activeStepName: { color: COLORS.primary, fontWeight: 'bold' },
  stepDesc: { fontSize: SIZES.font, color: COLORS.textLight, marginLeft: 34, marginBottom: SIZES.small },
  actionBtn: { backgroundColor: COLORS.accent, padding: SIZES.medium, borderRadius: SIZES.radius, alignItems: 'center', marginLeft: 34, marginTop: SIZES.small },
  actionBtnText: { color: COLORS.surface, fontSize: SIZES.font, fontWeight: 'bold' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.surface, padding: SIZES.large, ...SHADOWS.medium },
  homeBtn: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.primary, padding: SIZES.medium, borderRadius: SIZES.radius, alignItems: 'center' },
  homeBtnText: { color: COLORS.primary, fontSize: SIZES.medium, fontWeight: 'bold' },
  errorText: { textAlign: 'center', marginTop: 50, color: COLORS.error }
});
