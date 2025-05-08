import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, Button } from 'react-native';
import { Product } from '../api/ProductApi';
import { useFavorites } from '../contexts/FavoritesContext'; // Import FavoritesContext

export default function FavoritesScreen({ navigation }: any) {
    const { favoriteItems, removeFromFavorites, clearFavorites } = useFavorites(); // Add clearFavorites

    useEffect(() => {
        console.log('FavoritesScreen mounted');

        // Add confirmation alert that screen mounted successfully
        Alert.alert(
            "Screen Loaded",
            "Favorites screen loaded successfully!",
            [{ text: "OK" }]
        );

        // Make sure header title is set correctly
        navigation.setOptions({
            title: 'My Favorites'
        });
    }, [navigation]);

    const handleProductPress = (product: Product) => {
        navigation.navigate('ProductDetails', { product });
    };

    const handleRemoveFromFavorites = (productId: string) => {
        removeFromFavorites(productId);
        Alert.alert('Removed', 'Item has been removed from your favorites.');
    };

    const handleClearFavorites = () => {
        Alert.alert(
            'Clear Favorites',
            'Are you sure you want to clear all favorites?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: async () => await clearFavorites() },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {favoriteItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.shopButtonText}>Browse Products</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={favoriteItems}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.card}>
                                <Image
                                    source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                                    style={styles.image}
                                />
                                <View style={styles.cardContent}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => handleRemoveFromFavorites(item.id)}
                                    >
                                        <Text style={styles.removeButtonText}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    {/* Add Clear Favorites button */}
                    <View style={styles.clearButtonContainer}>
                        <Button
                            title="Clear All Favorites"
                            onPress={handleClearFavorites}
                            color="red"
                        />
                    </View>
                </>
            )}

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.navButtonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('Cart')}
                >
                    <Text style={styles.navButtonText}>Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('Favorites')}
                >
                    <Text style={styles.navButtonTextActive}>Favorites</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 70,
    },
    emptyText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#666',
    },
    shopButton: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    shopButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    card: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    image: {
        width: 100,
        height: 100,
    },
    cardContent: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    price: {
        fontSize: 14,
        color: '#888',
    },
    // Bottom navigation styles
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingVertical: 10,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    navButtonText: {
        fontSize: 16,
        color: '#666',
    },
    navButtonTextActive: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    removeButton: {
        backgroundColor: '#ff0000',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 10,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    clearButtonContainer: {
        marginBottom: 80, // Add space for the bottom navigation
        paddingVertical: 10,
    },
});

