import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext, API_URL } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/notifications/${user._id}`);
      setNotifications(data);
    } catch (error) {
      console.log('Error fetching notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
      setNotifications((prev) => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.log('Error marking as read', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      onPress={() => markAsRead(item._id)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{!item.isRead ? '🔔' : '✔️'}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.message, !item.isRead && styles.unreadMessage]}>{item.message}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have no notifications.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContainer: { padding: SIZES.large },
  notificationCard: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.surface, 
    padding: SIZES.medium, 
    borderRadius: SIZES.radius, 
    marginBottom: SIZES.medium, 
    alignItems: 'center',
    ...SHADOWS.light 
  },
  unreadCard: { borderLeftWidth: 4, borderLeftColor: COLORS.accent },
  iconContainer: { marginRight: SIZES.medium },
  icon: { fontSize: 24 },
  textContainer: { flex: 1 },
  message: { fontSize: SIZES.font, color: COLORS.textLight, marginBottom: 4 },
  unreadMessage: { color: COLORS.text, fontWeight: '600' },
  date: { fontSize: SIZES.font - 2, color: COLORS.textLight },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: SIZES.font, color: COLORS.textLight }
});
