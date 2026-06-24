import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { AuthContext, API_URL } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function DeliveryDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [stats, setStats] = useState({ remaining: 0, earnings: user?.totalEarnings || 0, completed: user?.ordersCompleted || 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get all available orders (Placed)
      const availableRes = await axios.get(`${API_URL}/orders/delivery/available`);
      // Get completed orders for this delivery boy to calculate earnings
      const myOrdersRes = await axios.get(`${API_URL}/orders/delivery/${user._id}`);
      
      const myCompleted = myOrdersRes.data.filter(o => o.status === 'Delivered');
      const earnings = myCompleted.reduce((acc, o) => acc + o.deliveryFee, 0);

      setStats({
        remaining: availableRes.data.length,
        earnings,
        completed: myCompleted.length
      });
    } catch (error) {
      console.log('Error fetching stats', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello,</Text>
          <Text style={styles.userName}>{user?.fullName || 'Delivery Partner'}!</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => router.push('/(delivery)/notifications')} style={styles.iconBtn}>
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(delivery)/profile')} style={styles.iconBtn}>
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{loading ? '-' : stats.remaining}</Text>
            <Text style={styles.statLabel}>Remaining Orders</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: COLORS.accent + '20' }]}>
            <Text style={[styles.statValue, { color: COLORS.accentDark }]}>
              ${loading ? '-' : stats.earnings.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: COLORS.accentDark }]}>Earnings</Text>
          </View>
          
          <View style={styles.statCardFull}>
            <Text style={styles.statValue}>{loading ? '-' : stats.completed}</Text>
            <Text style={styles.statLabel}>Orders Completed</Text>
          </View>
        </View>

        {/* View Order Details Button */}
        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => router.push('/(delivery)/order/list')}
        >
          <Text style={styles.actionBtnText}>View Order Details</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.large, paddingTop: 60, paddingBottom: SIZES.medium, backgroundColor: COLORS.surface, ...SHADOWS.light },
  greetingContainer: { flex: 1 },
  greetingText: { fontSize: SIZES.font, color: COLORS.textLight },
  userName: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary },
  headerIcons: { flexDirection: 'row' },
  iconBtn: { marginLeft: SIZES.small, width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', ...SHADOWS.light },
  iconText: { fontSize: 20 },
  scrollContent: { padding: SIZES.large },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: SIZES.large },
  statCard: { width: '48%', backgroundColor: COLORS.surface, padding: SIZES.large, borderRadius: SIZES.radius, alignItems: 'center', marginBottom: SIZES.medium, ...SHADOWS.light },
  statCardFull: { width: '100%', backgroundColor: COLORS.surface, padding: SIZES.large, borderRadius: SIZES.radius, alignItems: 'center', marginBottom: SIZES.medium, ...SHADOWS.light },
  statValue: { fontSize: 32, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  statLabel: { fontSize: SIZES.font, color: COLORS.textLight, fontWeight: '600' },
  actionBtn: { backgroundColor: COLORS.primary, padding: SIZES.large, borderRadius: SIZES.radius, alignItems: 'center', ...SHADOWS.medium },
  actionBtnText: { color: COLORS.surface, fontSize: SIZES.medium, fontWeight: 'bold' },
});
