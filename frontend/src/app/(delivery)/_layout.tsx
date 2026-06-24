import { Stack } from 'expo-router';

export default function DeliveryLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="order/[id]" options={{ title: 'Order Details' }} />
      <Stack.Screen name="actions/[id]" options={{ title: 'Delivery Actions' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="profile" options={{ title: 'My Profile' }} />
    </Stack>
  );
}
