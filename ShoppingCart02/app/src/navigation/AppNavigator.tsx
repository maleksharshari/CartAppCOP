import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Platform, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import LoginScreen from '../screens/LoginScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import ProductDetailsModal from '../screens/ProductDetailModel';

export type RootStackParamList = {
    Home: undefined;
    Cart: undefined;
    Payment: undefined;
    PaymentSuccess: undefined;
    Login: undefined;
    Favorites: undefined;
    ProductDetails: { product: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const auth = useContext(AuthContext);
    const cartContext = useContext(CartContext);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const cartItems = cartContext?.cartItems || [];
    const user = auth?.user;

    useEffect(() => {
        if (auth !== undefined) {
            setIsAuthReady(true);
        }
    }, [auth]);

    if (!isAuthReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );
    }

    // Use a very basic NavigationContainer with no linking config
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={user ? "Home" : "Login"}
                screenOptions={{
                    headerStyle: { backgroundColor: '#000000' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                {/* Include all screens regardless of authentication status */}
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Cart')}
                                style={{ marginRight: 15 }}
                            >
                                <Ionicons name="cart-outline" size={24} color="white" />
                                {cartItems.length > 0 && (
                                    <Ionicons
                                        name="ellipse"
                                        size={12}
                                        color="#4caf50"
                                        style={{
                                            position: 'absolute',
                                            top: -5,
                                            right: -5
                                        }}
                                    />
                                )}
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen name="Cart" component={CartScreen} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'My Favorites' }} />
                <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: "Payment" }} />
                <Stack.Screen
                    name="PaymentSuccess"
                    component={PaymentSuccessScreen}
                    options={{
                        title: "Order Confirmed",
                        headerLeft: () => null, // Disable back button
                        gestureEnabled: false // Disable swipe back gesture
                    }}
                />
                <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetailsModal}
                    options={{
                        presentation: Platform.OS === 'ios' || Platform.OS === 'android' ? 'modal' : 'card',
                        title: 'Product Details'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
