import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="category/[name]" options={{ title: 'Category' }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Product Details' }} />
      <Stack.Screen name="cart" options={{ title: 'My Cart' }} />
      <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
      <Stack.Screen name="order-confirmed" options={{ headerShown: false }} />
      <Stack.Screen name="order-tracking" options={{ title: 'Order Tracking' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="orders" options={{ title: 'My Orders' }} />
      <Stack.Screen name="profile" options={{ title: 'My Profile' }} />
    </Stack>
  );
}
