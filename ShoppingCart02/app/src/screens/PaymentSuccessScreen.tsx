import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import { useCart } from '../contexts/CartContext';

export default function PaymentSuccessScreen({ navigation, route }: any) {
    const [orderNumber, setOrderNumber] = useState('');
    const [orderDate, setOrderDate] = useState('');
    
    // Generate random order number on component mount
    useEffect(() => {
        // Generate a random alphanumeric order number
        const generateOrderNumber = () => {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const prefix = letters[Math.floor(Math.random() * letters.length)] + 
                          letters[Math.floor(Math.random() * letters.length)];
            const numbers = Math.floor(100000 + Math.random() * 900000); // 6-digit number
            return `${prefix}${numbers}`;
        };
        
        // Format current date
        const formatDate = () => {
            const date = new Date();
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };
        
        setOrderNumber(generateOrderNumber());
        setOrderDate(formatDate());
        
        // Prevent going back to payment screen
        navigation.setOptions({
            headerLeft: () => null,
            gestureEnabled: false
        });
    }, [navigation]);
    
    // Handle navigation back to home
    const handleContinueShopping = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.successContainer}>
                    {/* Success Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.checkmark}>
                            <Text style={styles.checkmarkSymbol}>✓</Text>
                        </View>
                    </View>
                    
                    <Text style={styles.successTitle}>Payment Successful!</Text>
                    <Text style={styles.successMessage}>
                        Thank you for your purchase. Your order has been confirmed.
                    </Text>
                    
                    {/* Order Information */}
                    <View style={styles.orderInfoContainer}>
                        <Text style={styles.orderInfoTitle}>ORDER INFORMATION</Text>
                        
                        <View style={styles.orderInfoRow}>
                            <Text style={styles.orderInfoLabel}>Order Number:</Text>
                            <Text style={styles.orderInfoValue}>{orderNumber}</Text>
                        </View>
                        
                        <View style={styles.orderInfoRow}>
                            <Text style={styles.orderInfoLabel}>Order Date:</Text>
                            <Text style={styles.orderInfoValue}>{orderDate}</Text>
                        </View>
                        
                        <View style={styles.orderInfoRow}>
                            <Text style={styles.orderInfoLabel}>Shipping Method:</Text>
                            <Text style={styles.orderInfoValue}>Standard Delivery</Text>
                        </View>
                        
                        <View style={styles.orderInfoRow}>
                            <Text style={styles.orderInfoLabel}>Estimated Delivery:</Text>
                            <Text style={styles.orderInfoValue}>3-5 Business Days</Text>
                        </View>
                    </View>
                    
                    {/* Confirmation Email Notice */}
                    <View style={styles.emailConfirmation}>
                        <Text style={styles.emailConfirmationText}>
                            A confirmation email has been sent to your email address.
                        </Text>
                    </View>
                    
                    {/* Continue Shopping Button */}
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinueShopping}
                    >
                        <Text style={styles.continueButtonText}>Continue Shopping</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
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
                    <Text style={styles.navButtonText}>Favorites</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 100, // Extra space for bottom navigation
        alignItems: 'center',
    },
    successContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
    },
    iconContainer: {
        marginBottom: 24,
    },
    checkmark: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkSymbol: {
        color: '#fff',
        fontSize: 48,
        fontWeight: 'bold',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    successMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
        paddingHorizontal: 20,
    },
    orderInfoContainer: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 8,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#eee',
    },
    orderInfoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    orderInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderInfoLabel: {
        fontSize: 15,
        color: '#666',
    },
    orderInfoValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
    },
    emailConfirmation: {
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    emailConfirmationText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
    continueButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
        width: '90%',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Bottom navigation styles (matching CartScreen)
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
});
