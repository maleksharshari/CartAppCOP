import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, Button } from 'react-native';
import { useCart } from '../contexts/CartContext';

export default function CartScreen({ navigation }: any) {
    const { cartItems, removeFromCart, clearCart } = useCart();

    useEffect(() => {
        console.log('CartScreen mounted');

        // Add confirmation alert that screen mounted successfully
        Alert.alert(
            "Screen Loaded",
            "Cart screen loaded successfully!",
            [{ text: "OK" }]
        );

        // Make sure header title is set correctly
        navigation.setOptions({
            title: 'My Cart'
        });
    }, [navigation]);

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            Alert.alert('Cart is empty', 'Please add items to your cart before checking out.');
            return;
        }
        navigation.navigate('Payment');
    };

    const handleRemoveFromCart = (productId: string) => {
        removeFromCart(productId);
        Alert.alert('Removed', 'Item has been removed from your cart.');
    };

    const handleClearCart = () => {
        Alert.alert(
            'Clear Cart',
            'Are you sure you want to clear the cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: async () => await clearCart() },
            ]
        );
    };

    const handleProductPress = (product: any) => {
        navigation.navigate('ProductDetails', { product });
    };

    return (
        <View style={styles.container}>
            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Your cart is empty</Text>
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
                        data={cartItems}
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
                                        onPress={() => handleRemoveFromCart(item.id)}
                                    >
                                        <Text style={styles.removeButtonText}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                    <View style={styles.checkoutContainer}>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={handleCheckout}
                        >
                            <Text style={styles.checkoutButtonText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.clearButtonContainer}>
                        <Button
                            title="Clear Cart"
                            onPress={handleClearCart}
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
                    <Text style={styles.navButtonTextActive}>Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('Favorites')}
                >
                    <Text style={styles.navButtonText}>Favorites</Text>
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
    checkoutContainer: {
        marginBottom: 10,
    },
    checkoutButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
