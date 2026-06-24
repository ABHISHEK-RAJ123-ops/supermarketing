import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CartContext } from '../../context/CartContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function Cart() {
  const { cartItems, updateQty, removeFromCart } = useContext(CartContext);
  const router = useRouter();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = itemsPrice >= 30 || itemsPrice === 0 ? 0 : 3;
  const grandTotal = itemsPrice + deliveryFee;
  const amountForFreeDelivery = 30 - itemsPrice;

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemServings}>Per Servings: {item.servings}</Text>
        <Text style={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
      </View>
      <View style={styles.qtyContainer}>
        <TouchableOpacity 
          style={styles.qtyBtn} 
          onPress={() => item.qty > 1 ? updateQty(item._id, item.qty - 1) : removeFromCart(item._id)}
        >
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{item.qty}</Text>
        <TouchableOpacity 
          style={styles.qtyBtn} 
          onPress={() => updateQty(item._id, item.qty + 1)}
        >
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.replace('/(customer)/dashboard')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
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

            {amountForFreeDelivery > 0 && (
              <Text style={styles.freeDeliveryNote}>
                Add ${amountForFreeDelivery.toFixed(2)} more for FREE delivery!
              </Text>
            )}

            <View style={[styles.summaryRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Grand Total:</Text>
              <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
              style={styles.checkoutBtn} 
              onPress={() => router.push('/(customer)/checkout')}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: SIZES.large,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SIZES.small,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.base,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: SIZES.small,
  },
  itemName: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  itemServings: {
    fontSize: SIZES.font - 1,
    color: COLORS.primary,
    fontFamily: 'serif',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: SIZES.medium,
    fontWeight: '800',
    color: COLORS.accentDark,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.base,
  },
  qtyBtn: {
    padding: 8,
  },
  qtyText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  qtyValue: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  summaryContainer: {
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderTopLeftRadius: SIZES.extraLarge,
    borderTopRightRadius: SIZES.extraLarge,
    ...SHADOWS.medium,
  },
  summaryTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.primary,
  },
  freeDeliveryNote: {
    fontSize: SIZES.font - 2,
    color: COLORS.warning,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.small,
    marginTop: SIZES.small,
  },
  grandTotalLabel: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.accentDark,
  },
  checkoutBtn: {
    backgroundColor: COLORS.accent,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: SIZES.large,
  },
  checkoutBtnText: {
    color: COLORS.surface,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.large,
    color: COLORS.textLight,
    marginBottom: SIZES.medium,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.extraLarge,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radius,
  },
  shopBtnText: {
    color: COLORS.surface,
    fontWeight: 'bold',
  },
});
