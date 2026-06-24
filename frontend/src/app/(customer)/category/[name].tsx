import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

interface Product {
  _id: string;
  name: string;
  image: string;
  servings: string;
  rating: number;
  price: number;
}

export default function CategoryProducts() {
  const { name } = useLocalSearchParams();
  const categoryNameStr = typeof name === 'string' ? name : name?.[0] || '';
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [name]);

  const fetchProducts = async () => {
    try {
      // Decode name as it might be URI encoded
      const categoryName = decodeURIComponent(categoryNameStr);
      const { data } = await axios.get(`${API_URL}/products/category/${categoryName}`);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push(`/(customer)/product/${item._id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productServings}>Per Servings: {item.servings}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
        </View>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{decodeURIComponent(categoryNameStr)}</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 50 }} />
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.noProductsText}>No products found.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    padding: SIZES.large,
    paddingTop: SIZES.extraLarge,
  },
  searchContainer: {
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.medium,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.medium,
    paddingVertical: 12,
    fontSize: SIZES.font,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#e2e8f0', // using a light border color or use COLORS.border if it exists
  },
  listContainer: {
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.extraLarge,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.medium,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: SIZES.small,
  },
  productName: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  productServings: {
    fontSize: SIZES.font - 1,
    color: COLORS.primary,
    fontFamily: 'serif',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: SIZES.font - 2,
    color: COLORS.textLight,
  },
  productPrice: {
    fontSize: SIZES.medium,
    fontWeight: '800',
    color: COLORS.accentDark,
  },
  noProductsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: SIZES.font,
    color: COLORS.textLight,
  },
});
