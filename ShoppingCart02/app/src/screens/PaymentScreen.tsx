import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useCart } from '../contexts/CartContext';

export default function PaymentScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [creditCard, setCreditCard] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const { cartItems, clearCart } = useCart();

    useEffect(() => {
        navigation.setOptions({
            title: 'Checkout'
        });
    }, [navigation]);

    // Calculate total price of items in cart
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    const handlePayment = () => {
        if (!name || !address || !city || !zipCode || !creditCard || !expiryDate || !cvv) {
            Alert.alert('Incomplete Information', 'Please fill in all fields to complete your purchase.');
            return;
        }

        // Credit card validation (simple check)
        if (creditCard.length < 16 || !/^\d+$/.test(creditCard.replace(/\s/g, ''))) {
            Alert.alert('Invalid Card', 'Please enter a valid credit card number.');
            return;
        }

        // CVV validation
        if (cvv.length < 3 || !/^\d+$/.test(cvv)) {
            Alert.alert('Invalid CVV', 'Please enter a valid CVV code.');
            return;
        }

        // Show processing state
        setIsProcessing(true);

        // Simulate payment processing with a delay
        setTimeout(() => {
            // Clear the cart after successful payment
            clearCart();

            // Navigate to success screen instead of showing alert
            navigation.navigate('PaymentSuccess');

            // Reset processing state
            setIsProcessing(false);
        }, 2000);
    };

    const formatCreditCard = (text: string) => {
        // Remove non-digit characters
        const cleaned = text.replace(/\D/g, '');
        // Limit to 16 digits
        const limited = cleaned.substring(0, 16);
        // Add spaces after every 4 digits
        const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
        return formatted;
    };

    const formatExpiryDate = (text: string) => {
        // Remove non-digit characters
        const cleaned = text.replace(/\D/g, '');
        // Format as MM/YY
        if (cleaned.length > 2) {
            return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
        }
        return cleaned;
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Shipping Information</Text>
                    <TextInput
                        placeholder="Full Name"
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                    />
                    <TextInput
                        placeholder="Address"
                        style={styles.input}
                        onChangeText={setAddress}
                        value={address}
                    />
                    <View style={styles.rowInputs}>
                        <TextInput
                            placeholder="City"
                            style={[styles.input, styles.halfInput]}
                            onChangeText={setCity}
                            value={city}
                        />
                        <TextInput
                            placeholder="ZIP Code"
                            style={[styles.input, styles.halfInput]}
                            keyboardType="number-pad"
                            onChangeText={setZipCode}
                            value={zipCode}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <TextInput
                        placeholder="Card Number"
                        style={styles.input}
                        keyboardType="number-pad"
                        onChangeText={(text) => setCreditCard(formatCreditCard(text))}
                        value={creditCard}
                    />
                    <View style={styles.rowInputs}>
                        <TextInput
                            placeholder="MM/YY"
                            style={[styles.input, styles.halfInput]}
                            keyboardType="number-pad"
                            maxLength={5}
                            onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                            value={expiryDate}
                        />
                        <TextInput
                            placeholder="CVV"
                            style={[styles.input, styles.halfInput]}
                            keyboardType="number-pad"
                            maxLength={3}
                            onChangeText={setCvv}
                            value={cvv}
                            secureTextEntry
                        />
                    </View>
                </View>

                <View style={styles.orderSummary}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Items ({cartItems.length})</Text>
                        <Text style={styles.summaryValue}>${totalPrice}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={styles.summaryValue}>$0.00</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tax</Text>
                        <Text style={styles.summaryValue}>${(parseFloat(totalPrice) * 0.08).toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>
                            ${(parseFloat(totalPrice) + parseFloat(totalPrice) * 0.08).toFixed(2)}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.paymentButton, isProcessing && styles.paymentButtonDisabled]}
                    onPress={handlePayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <View style={styles.processingContainer}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={styles.paymentButtonText}> Processing...</Text>
                        </View>
                    ) : (
                        <Text style={styles.paymentButtonText}>Complete Order</Text>
                    )}
                </TouchableOpacity>
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
        </KeyboardAvoidingView>
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
    },
    formSection: {
        marginBottom: 20,
    },
    orderSummary: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        padding: 14,
        marginBottom: 16,
        borderRadius: 8,
        fontSize: 16,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
    },
    summaryValue: {
        fontSize: 16,
        color: '#333',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    paymentButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    paymentButtonText: {
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
    processingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentButtonDisabled: {
        backgroundColor: '#666',
    },
});
