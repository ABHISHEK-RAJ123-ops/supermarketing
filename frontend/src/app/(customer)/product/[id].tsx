import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { AuthContext, API_URL } from '../../../context/AuthContext';
import { CartContext } from '../../../context/CartContext';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [isEditingReview, setIsEditingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, qty });
    Alert.alert('Added to Cart', `${qty} ${product.name} added to your cart.`);
  };

  const submitReview = async () => {
    try {
      if (isEditingReview) {
        await axios.put(`${API_URL}/products/${id}/reviews`, {
          rating: Number(rating),
          comment,
          userId: user._id,
        });
        Alert.alert('Success', 'Review updated successfully!');
      } else {
        await axios.post(`${API_URL}/products/${id}/reviews`, {
          rating: Number(rating),
          comment,
          userId: user._id,
          name: user.fullName,
        });
        Alert.alert('Success', 'Review submitted successfully!');
      }
      setComment('');
      setRating('5');
      setIsEditingReview(false);
      fetchProduct(); // refresh to show new rating
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit review');
    }
  };

  const deleteReview = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete your review?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await axios.delete(`${API_URL}/products/${id}/reviews/${user._id}`);
          Alert.alert('Success', 'Review deleted successfully!');
          fetchProduct();
        } catch (error: any) {
          Alert.alert('Error', error.response?.data?.message || 'Failed to delete review');
        }
      }}
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 50 }} />;
  }

  if (!product) {
    return <Text style={styles.errorText}>Product not found.</Text>;
  }

  const totalPrice = (product.price * qty).toFixed(2);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.categoryText}>{product.category}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.servingsText}>Per Servings: {product.servings}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {product.rating.toFixed(1)}</Text>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {product.description || `Fresh and high-quality ${product.name} sourced locally. Perfect for your daily needs.`}
          </Text>

          {/* Quantity Selector & Price */}
          <View style={styles.qtyContainer}>
            <View style={styles.qtyControl}>
              <TouchableOpacity onPress={() => setQty(qty > 1 ? qty - 1 : 1)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity onPress={() => setQty(qty + 1)} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.totalPrice}>${totalPrice}</Text>
          </View>

          {/* Add to Cart */}
          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          {/* Review Section */}
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>{isEditingReview ? 'Edit Your Review' : 'Write a Review'}</Text>
            <View style={styles.reviewInputRow}>
              <Text style={styles.label}>Rating (1-5):</Text>
              <TextInput 
                style={styles.ratingInput} 
                value={rating} 
                onChangeText={setRating} 
                keyboardType="numeric" 
                maxLength={1} 
              />
            </View>
            <TextInput 
              style={styles.commentInput} 
              placeholder="Share your thoughts..." 
              value={comment} 
              onChangeText={setComment} 
              multiline 
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={[styles.submitReviewBtn, { flex: 1 }]} onPress={submitReview}>
                <Text style={styles.submitReviewText}>{isEditingReview ? 'Update Review' : 'Submit Review'}</Text>
              </TouchableOpacity>
              {isEditingReview && (
                <TouchableOpacity 
                  style={[styles.submitReviewBtn, { flex: 1, backgroundColor: COLORS.border }]} 
                  onPress={() => {
                    setIsEditingReview(false);
                    setComment('');
                    setRating('5');
                  }}
                >
                  <Text style={[styles.submitReviewText, { color: COLORS.text }]}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* Existing Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <View style={styles.reviewsListSection}>
              <Text style={styles.sectionTitle}>Customer Reviews ({product.numReviews})</Text>
              {product.reviews.map((review: any, index: number) => (
                <View key={index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <Text style={[styles.reviewRatingBadge, { marginLeft: 8 }]}>⭐ {review.rating}</Text>
                    </View>
                    {review.user === user._id && (
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={() => {
                          setRating(review.rating.toString());
                          setComment(review.comment || '');
                          setIsEditingReview(true);
                        }}>
                          <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={deleteReview}>
                          <Text style={{ color: COLORS.error, fontWeight: 'bold' }}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  {review.comment ? (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 40 },
  productImage: { width: '100%', height: 300, resizeMode: 'cover' },
  detailsContainer: {
    padding: SIZES.large,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.xxl,
    borderTopRightRadius: SIZES.xxl,
    marginTop: -30,
    ...SHADOWS.medium,
  },
  categoryText: { color: COLORS.accent, fontWeight: '600', fontSize: SIZES.font, marginBottom: 4 },
  productName: { fontSize: 26, fontWeight: '800', color: COLORS.primary, marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.large },
  servingsText: { fontSize: SIZES.font + 1, color: COLORS.primary, fontWeight: '600', fontFamily: 'serif', fontStyle: 'italic' },
  ratingBadge: { backgroundColor: '#FFF9E6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  ratingText: { color: COLORS.warning, fontWeight: 'bold' },
  sectionTitle: { fontSize: SIZES.large, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  descriptionText: { fontSize: SIZES.font, color: COLORS.text, lineHeight: 22, marginBottom: SIZES.extraLarge },
  qtyContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.large },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border },
  qtyBtn: { paddingHorizontal: 20, paddingVertical: 10 },
  qtyBtnText: { fontSize: SIZES.large, color: COLORS.primary, fontWeight: 'bold' },
  qtyText: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.primary, paddingHorizontal: 10 },
  totalPrice: { fontSize: 28, fontWeight: '800', color: COLORS.accentDark },
  addToCartBtn: { backgroundColor: COLORS.accent, padding: SIZES.medium, borderRadius: SIZES.radius, alignItems: 'center', ...SHADOWS.light, marginBottom: SIZES.xxl },
  addToCartText: { color: COLORS.surface, fontSize: SIZES.large, fontWeight: 'bold' },
  reviewSection: { marginTop: SIZES.medium },
  reviewInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.small },
  label: { fontSize: SIZES.font, color: COLORS.text, marginRight: 10 },
  ratingInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.base, width: 40, textAlign: 'center', padding: 4 },
  commentInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: SIZES.medium, height: 80, textAlignVertical: 'top', marginBottom: SIZES.small },
  submitReviewBtn: { backgroundColor: COLORS.secondary, padding: 12, borderRadius: SIZES.radius, alignItems: 'center' },
  submitReviewText: { color: COLORS.surface, fontWeight: 'bold' },
  errorText: { textAlign: 'center', marginTop: 50, color: COLORS.error },
  reviewsListSection: { marginTop: SIZES.large, paddingTop: SIZES.medium, borderTopWidth: 1, borderColor: COLORS.border },
  reviewCard: { backgroundColor: COLORS.background, padding: SIZES.medium, borderRadius: SIZES.radius, marginBottom: SIZES.small, borderWidth: 1, borderColor: COLORS.border },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewerName: { fontWeight: 'bold', color: COLORS.primary, fontSize: SIZES.font },
  reviewRatingBadge: { fontSize: SIZES.font, color: COLORS.warning, fontWeight: 'bold' },
  reviewComment: { color: COLORS.text, fontSize: SIZES.font - 1, marginTop: 4 }
});
