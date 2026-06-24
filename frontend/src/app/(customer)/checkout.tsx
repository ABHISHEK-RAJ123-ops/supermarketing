import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { AuthContext, API_URL } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function Checkout() {
  const { user } = useContext(AuthContext);
  const { cartItems, clearCart, selectedBranch } = useContext(CartContext);
  const router = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [loading, setLoading] = useState(false);

  const itemsPrice = cartItems.reduce((acc: number, item: any) => acc + item.price * item.qty, 0);
  const deliveryFee = itemsPrice >= 30 || itemsPrice === 0 ? 0 : 3;
  const grandTotal = itemsPrice + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!deliveryAddress || !phone) {
      Alert.alert('Validation Error', 'Please enter your delivery address and phone number.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map((i: any) => ({
          name: i.name,
          qty: i.qty,
          image: i.image,
          price: i.price,
          servings: i.servings,
          product: i._id,
        })),
        deliveryAddress,
        paymentMethod,
        itemsPrice,
        deliveryFee,
        grandTotal,
        phone,
        customerId: user._id,
        branch: selectedBranch,
      };

      const { data } = await axios.post(`${API_URL}/orders`, orderData);
      
      // Also trigger a notification for the system/delivery boy here if needed,
      // but the backend handles broadcasting `new_order` event via Socket.io.
      
      clearCart();
      router.replace({ pathname: '/(customer)/order-confirmed', params: { orderId: data._id } });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          
          <Text style={styles.label}>Delivery Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter full address" 
            placeholderTextColor={COLORS.textLight}
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            multiline
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter phone number" 
            placeholderTextColor={COLORS.textLight}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity 
              style={[styles.paymentBtn, paymentMethod === 'Card' && styles.paymentBtnActive]}
              onPress={() => setPaymentMethod('Card')}
            >
              <Text style={[styles.paymentBtnText, paymentMethod === 'Card' && styles.paymentBtnTextActive]}>💳 Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.paymentBtn, paymentMethod === 'Cash on Delivery' && styles.paymentBtnActive]}
              onPress={() => setPaymentMethod('Cash on Delivery')}
            >
              <Text style={[styles.paymentBtnText, paymentMethod === 'Cash on Delivery' && styles.paymentBtnTextActive]}>💵 Cash on Delivery</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Branch:</Text>
            <Text style={styles.summaryValue}>{selectedBranch}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({cartItems.length}):</Text>
            <Text style={styles.summaryValue}>${itemsPrice.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee:</Text>
            <Text style={styles.summaryValue}>
              {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
            </Text>
          </View>

          <View style={[styles.summaryRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.surface} />
          ) : (
            <Text style={styles.placeOrderBtnText}>Place Order - ${grandTotal.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SIZES.large, paddingBottom: 100 },
  sectionCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.large,
    ...SHADOWS.light,
  },
  sectionTitle: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary, marginBottom: SIZES.medium },
  label: { fontSize: SIZES.font, color: COLORS.text, fontWeight: '600', marginBottom: 6, marginTop: SIZES.small },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius,
    padding: SIZES.medium, fontSize: SIZES.font, color: COLORS.text, backgroundColor: COLORS.background,
  },
  paymentMethods: { flexDirection: 'row', justifyContent: 'space-between' },
  paymentBtn: {
    flex: 1, height: 50, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius,
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 4, backgroundColor: COLORS.background,
  },
  paymentBtnActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  paymentBtnText: { color: COLORS.textLight, fontSize: SIZES.font, fontWeight: '600' },
  paymentBtnTextActive: { color: COLORS.surface },
  summaryContainer: {
    backgroundColor: COLORS.surface, padding: SIZES.large, borderRadius: SIZES.radius, ...SHADOWS.light,
  },
  summaryTitle: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary, marginBottom: SIZES.medium },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: SIZES.font, color: COLORS.textLight },
  summaryValue: { fontSize: SIZES.font, fontWeight: '600', color: COLORS.primary },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SIZES.small, marginTop: SIZES.small },
  grandTotalLabel: { fontSize: SIZES.medium, fontWeight: 'bold', color: COLORS.primary },
  grandTotalValue: { fontSize: 22, fontWeight: '800', color: COLORS.accentDark },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, padding: SIZES.large,
    borderTopLeftRadius: SIZES.extraLarge, borderTopRightRadius: SIZES.extraLarge, ...SHADOWS.medium,
  },
  placeOrderBtn: {
    backgroundColor: COLORS.accent, height: 55, borderRadius: SIZES.radius,
    justifyContent: 'center', alignItems: 'center',
  },
  placeOrderBtnText: { color: COLORS.surface, fontSize: SIZES.medium, fontWeight: 'bold' },
});
