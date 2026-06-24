import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { AuthContext, API_URL } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function CustomerProfile() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ordersCount: 0, reviewsCount: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const ordersRes = await axios.get(`${API_URL}/orders/customer/${user._id}`);
      
      let newReviewsCount = user?.reviewsCount || 0;
      if (user?.token) {
        const profileRes = await axios.get(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (profileRes.data && profileRes.data.reviewsCount !== undefined) {
          newReviewsCount = profileRes.data.reviewsCount;
        }
      }

      setStats({ ordersCount: ordersRes.data.length, reviewsCount: newReviewsCount });
    } catch (error) {
      console.log('Error fetching stats', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updateData: any = { fullName, city, country };
      if (password) updateData.password = password;

      await axios.put(`${API_URL}/auth/profile`, updateData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      Alert.alert('Success', 'Profile updated successfully.');
      setPassword('');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirm', 'Are you sure you want to delete your account? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/auth/profile`, {
              headers: { Authorization: `Bearer ${user.token}` }
            });
            await logout();
            router.replace('/(auth)/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete account');
          }
      }}
    ]);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (loading) return <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Info Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{fullName.charAt(0)}</Text>
          </View>
          <Text style={styles.roleBadge}>{user?.role}</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statBox} onPress={() => router.push('/(customer)/orders')}>
            <Text style={styles.statValue}>{stats.ordersCount}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.reviewsCount}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Profile Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Profile Details</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {!isEditing ? (
            <View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>{fullName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>City/Town</Text>
                <Text style={styles.detailValue}>{city || 'Not provided'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Country</Text>
                <Text style={styles.detailValue}>{country || 'Not provided'}</Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: SIZES.small }]}>
                  <Text style={styles.label}>City/Town</Text>
                  <TextInput style={styles.input} value={city} onChangeText={setCity} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Country</Text>
                  <TextInput style={styles.input} value={country} onChangeText={setCountry} />
                </View>
              </View>

              <Text style={styles.label}>New Password (Optional)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Leave blank to keep current" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
              />

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                  setIsEditing(false);
                  setFullName(user?.fullName || '');
                  setCity(user?.city || '');
                  setCountry(user?.country || '');
                  setPassword('');
                }}>
                  <Text style={styles.btnTextPrimary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.btnTextSurface}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Danger Zone */}
        <View style={[styles.card, { borderColor: COLORS.error, borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.error }]}>Account Actions</Text>
          
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.btnTextPrimary}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.btnTextError}>Delete Account</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SIZES.large },
  profileHeader: { alignItems: 'center', marginBottom: SIZES.large },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SIZES.small },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: COLORS.surface },
  roleBadge: { backgroundColor: COLORS.accent, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, color: COLORS.surface, fontSize: SIZES.font - 2, fontWeight: 'bold', marginBottom: 4 },
  emailText: { fontSize: SIZES.font, color: COLORS.textLight },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.large },
  statBox: { flex: 1, backgroundColor: COLORS.surface, padding: SIZES.medium, borderRadius: SIZES.radius, alignItems: 'center', marginHorizontal: 4, ...SHADOWS.light },
  statValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: SIZES.font, color: COLORS.textLight },
  card: { backgroundColor: COLORS.surface, padding: SIZES.large, borderRadius: SIZES.radius, marginBottom: SIZES.large, ...SHADOWS.light },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.medium },
  sectionTitle: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary },
  editBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: SIZES.font },
  detailRow: { marginBottom: SIZES.medium },
  detailLabel: { fontSize: SIZES.small, color: COLORS.textLight, marginBottom: 2 },
  detailValue: { fontSize: SIZES.font, color: COLORS.text, fontWeight: '500' },
  label: { fontSize: SIZES.font, color: COLORS.text, fontWeight: '600', marginBottom: 6, marginTop: SIZES.small },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: SIZES.medium, fontSize: SIZES.font, color: COLORS.text, backgroundColor: COLORS.background },
  row: { flexDirection: 'row' },
  inputGroup: { marginBottom: SIZES.small },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: SIZES.large },
  cancelBtn: { backgroundColor: COLORS.background, paddingHorizontal: SIZES.large, paddingVertical: SIZES.medium, borderRadius: SIZES.radius, marginRight: SIZES.small, borderWidth: 1, borderColor: COLORS.primary },
  saveBtn: { backgroundColor: COLORS.accent, paddingHorizontal: SIZES.large, paddingVertical: SIZES.medium, borderRadius: SIZES.radius, ...SHADOWS.light },
  btnTextSurface: { color: COLORS.surface, fontWeight: 'bold', fontSize: SIZES.font },
  logoutBtn: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.primary, padding: SIZES.medium, borderRadius: SIZES.radius, alignItems: 'center', marginBottom: SIZES.medium },
  deleteBtn: { backgroundColor: COLORS.error + '20', padding: SIZES.medium, borderRadius: SIZES.radius, alignItems: 'center' },
  btnTextPrimary: { color: COLORS.primary, fontWeight: 'bold', fontSize: SIZES.font },
  btnTextError: { color: COLORS.error, fontWeight: 'bold', fontSize: SIZES.font },
});
