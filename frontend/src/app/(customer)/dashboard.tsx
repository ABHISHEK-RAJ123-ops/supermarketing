import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const BRANCHES = ['Kochi', 'Thiruvananthapuram', 'Kozhikode'];

const CATEGORIES = [
  { id: '1', name: 'Fresh Produce', icon: '🍎' },
  { id: '2', name: 'Dairy & Eggs', icon: '🥛' },
  { id: '3', name: 'Meat', icon: '🥩' },
  { id: '4', name: 'Bakery', icon: '🥐' },
  { id: '5', name: 'Grains', icon: '🍚' },
  { id: '6', name: 'Snacks', icon: '🥨' },
  { id: '7', name: 'Beverages', icon: '🥤' },
  { id: '8', name: 'Frozen Foods', icon: '🧊' },
  { id: '9', name: 'Household', icon: '🧻' },
  { id: '10', name: 'Grooming', icon: '🧴' },
  { id: '11', name: 'Baby Care', icon: '🍼' },
  { id: '12', name: 'Pet Supplies', icon: '🐕' },
];

export default function CustomerDashboard() {
  const { user } = useContext(AuthContext);
  const { selectedBranch, setSelectedBranch } = useContext(CartContext);
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const navigateToCategory = (categoryName: string) => {
    router.push(`/(customer)/category/${categoryName}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello,</Text>
          <Text style={styles.userName}>{user?.fullName || 'Customer'}!</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => router.push('/(customer)/cart')} style={styles.iconBtn}>
            <Text style={styles.iconText}>🛒</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(customer)/notifications')} style={styles.iconBtn}>
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(customer)/profile')} style={styles.iconBtn}>
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Branch Selection */}
        <View style={styles.branchContainer}>
          <TouchableOpacity 
            style={styles.dropdownToggle} 
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.dropdownText}>Select Branch: {selectedBranch}</Text>
            <Text style={styles.dropdownIcon}>{showDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownList}>
              {BRANCHES.map((branch) => (
                <TouchableOpacity 
                  key={branch} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedBranch(branch);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{branch}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Branch Details */}
        <View style={styles.branchDetailsCard}>
          <Text style={styles.branchTitle}>A-Z Supermarket - {selectedBranch}</Text>
          <Text style={styles.branchSubtitle}>⭐ Average Product Rating: 4.8</Text>
          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryBadgeText}>Free delivery above $30</Text>
          </View>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={styles.categoryCard}
              onPress={() => navigateToCategory(cat.name)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingTop: 60, // Safe area for iOS/Android
    paddingBottom: SIZES.medium,
    backgroundColor: COLORS.surface,
    ...SHADOWS.light,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
  },
  userName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: SIZES.small,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  iconText: {
    fontSize: 20,
  },
  scrollContent: {
    padding: SIZES.large,
  },
  branchContainer: {
    marginBottom: SIZES.medium,
    zIndex: 10,
  },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownText: {
    fontSize: SIZES.font,
    color: COLORS.primary,
    fontWeight: '600',
  },
  dropdownIcon: {
    color: COLORS.textLight,
  },
  dropdownList: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  dropdownItem: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemText: {
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  branchDetailsCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.extraLarge,
    ...SHADOWS.medium,
    alignItems: 'center',
  },
  branchTitle: {
    fontSize: SIZES.large,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  branchSubtitle: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
    marginBottom: SIZES.medium,
  },
  deliveryBadge: {
    backgroundColor: COLORS.accent + '20', // 20% opacity
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radius,
  },
  deliveryBadgeText: {
    color: COLORS.accentDark,
    fontWeight: 'bold',
    fontSize: SIZES.font,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '31%', // 3 per row
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: SIZES.small,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
});
