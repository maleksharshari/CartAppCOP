import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../api/ProductApi';
import { useReviews } from '../contexts/ReviewContext';
import { ReviewCreateDto } from '../types/DTOs';
import { auth } from '../services/firebase';

interface ProductDetailModelProps {
    route: {
        params: {
            product: Product;
        };
    };
    navigation: any;
}

export default function ProductDetailModel({ route, navigation }: ProductDetailModelProps) {
    const { product } = route.params;
    const { addToFavorites } = useFavorites();
    const { addToCart } = useCart();
    const { reviews, loading, error, fetchReviewsByProductId, createReview } = useReviews();

    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Fetch reviews when the component mounts
        fetchReviewsByProductId(product.id);
    }, [product.id]);

    const handleAddToCart = async () => {
        try {
            await addToCart(product);
            Alert.alert('Success', `${product.name} has been added to your cart!`);
        } catch (error) {
            Alert.alert('Error', 'Failed to add product to cart.');
            console.error(error);
        }
    };

    const handleAddToFavorites = async () => {
        try {
            await addToFavorites(product);
            Alert.alert('Success', `${product.name} added to favorites!`);
        } catch (error) {
            Alert.alert('Error', 'Failed to add product to favorites.');
            console.error(error);
        }
    };

    const handleSubmitReview = async () => {
        if (!auth.currentUser) {
            Alert.alert('Error', 'You must be logged in to submit a review');
            return;
        }

        if (comment.trim() === '') {
            Alert.alert('Error', 'Please enter a comment');
            return;
        }

        try {
            setIsSubmitting(true);
            const reviewData: ReviewCreateDto = {
                productId: product.id,
                userId: auth.currentUser.uid,
                comment,
            };

            await createReview(reviewData);
            Alert.alert('Success', 'Your review has been submitted!');
            setComment('');
        } catch (error) {
            Alert.alert('Error', 'Failed to submit review');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderReview = ({ item }: { item: any }) => (
        <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{item.userEmail || 'Anonymous'}</Text>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
            <Text style={styles.reviewDate}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleAddToCart}
                >
                    <Ionicons name="cart-outline" size={24} color="#fff" />
                    <Text style={styles.actionButtonText}>Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleAddToFavorites}
                >
                    <Ionicons name="heart-outline" size={24} color="#fff" />
                    <Text style={styles.actionButtonText}>Add to Favorites</Text>
                </TouchableOpacity>
            </View>

            {/* Reviews Section */}
            <View style={styles.reviewsSection}>
                <Text style={styles.sectionTitle}>Reviews</Text>

                {/* Add review form */}
                <View style={styles.addReviewForm}>
                    <Text style={styles.formLabel}>Write a Review:</Text>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Share your thoughts about this product..."
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        editable={!isSubmitting}
                    />
                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                        onPress={handleSubmitReview}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Review</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Existing reviews */}
                <View style={styles.existingReviews}>
                    <Text style={styles.reviewsTitle}>
                        Customer Reviews ({reviews.length})
                    </Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#0066cc" />
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : reviews.length === 0 ? (
                        <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
                    ) : (
                        <FlatList
                            data={reviews}
                            renderItem={renderReview}
                            keyExtractor={(item) => item.id}
                            style={styles.reviewsList}
                            scrollEnabled={false}
                        />
                    )}
                </View>
            </View>

            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    image: { width: '100%', height: 250, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    price: { fontSize: 20, color: '#888', marginBottom: 16 },
    description: { fontSize: 16, marginBottom: 16 },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 10
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        minWidth: 150,
    },
    actionButtonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
    },
    closeButton: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignSelf: 'center',
        minWidth: 150,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    // Review section styles
    reviewsSection: {
        marginTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    addReviewForm: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
    },
    formLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    existingReviews: {
        marginBottom: 16,
    },
    reviewsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        marginVertical: 16,
        textAlign: 'center',
    },
    noReviewsText: {
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        padding: 16,
    },
    reviewsList: {
        marginTop: 8,
    },
    reviewItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    reviewAuthor: {
        fontWeight: '600',
        fontSize: 16,
    },
    reviewComment: {
        fontSize: 15,
        marginVertical: 8,
    },
    reviewDate: {
        color: '#888',
        fontSize: 12,
        alignSelf: 'flex-end',
    },
});
