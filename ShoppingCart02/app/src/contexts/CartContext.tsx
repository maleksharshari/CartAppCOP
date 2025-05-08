import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ProductApi } from '../api/ProductApi'; // Import ProductApi
import UserApi from '../api/UserApi';
import { useAuth } from './AuthContext'; // Import useAuth instead of accessing auth directly
import { AddToCartOrFavDto } from '../types/DTOs';

interface CartContextType {
    cartItems: Product[];
    addToCart: (product: Product) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    isLoading: boolean; // Add loading state
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const { user, isLoading: authLoading } = useAuth(); // Get user and auth loading state

    // Only attempt to load cart when auth is no longer loading
    useEffect(() => {
        if (authLoading) return; // Wait for auth to finish loading

        const loadCart = async () => {
            setIsLoading(true); // Start loading

            if (!user) {
                // User not logged in, but auth is done loading
                console.log('No authenticated user found');
                setCartItems([]);
                setIsLoading(false);
                return;
            }

            try {
                const userId = user.uid;
                console.log('Loading cart for user:', userId);

                // Fetch user by ID and get cart product IDs
                const userData = await UserApi.getUserById(userId);
                if (userData && userData.cart && userData.cart.length > 0) {
                    console.log('User cart data found:', userData.cart);
                    // Fetch product details for each product ID in the cart
                    const cartProducts = await Promise.all(
                        userData.cart.map((productId: string) => ProductApi.getProductById(productId))
                    );
                    // Filter out any null products (in case a product wasn't found)
                    setCartItems(cartProducts.filter((product) => product !== null) as Product[]);
                } else {
                    console.log('User has no items in cart or cart not initialized');
                    setCartItems([]);
                }
            } catch (error) {
                console.error('Failed to load cart:', error);
                setCartItems([]);
            } finally {
                setIsLoading(false); // End loading regardless of outcome
            }
        };

        loadCart();

        return () => {
            setCartItems([]); // Cleanup cart items on unmount
        };
    }, [user, authLoading]); // Ensure dependencies are correct

    useEffect(() => {
        const saveCart = async () => {
            if (user) {
                try {
                    await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
                } catch (error) {
                    console.error('Failed to save cart to storage:', error);
                }
            }
        };

        saveCart();
    }, [cartItems, user]);

    const addToCart = async (product: Product) => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        setIsLoading(true); // Start loading
        try {
            const userId = user.uid;
            const dto: AddToCartOrFavDto = { userId, productId: product.id };
            console.log('Adding to cart:', dto);

            const updatedUser = await UserApi.addToCart(dto);
            console.log('Updated user cart:', updatedUser.cart);

            const updatedCartProducts = await Promise.all(
                updatedUser.cart.map((productId: string) => ProductApi.getProductById(productId))
            );
            setCartItems(updatedCartProducts.filter((product) => product !== null) as Product[]);
        } catch (error) {
            console.error('Failed to add product to cart:', error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        setIsLoading(true); // Start loading
        try {
            const userId = user.uid;
            const dto: AddToCartOrFavDto = { userId, productId };
            console.log('Removing from cart:', dto);

            const updatedUser = await UserApi.removeFromCart(dto);
            console.log('Updated user cart:', updatedUser.cart);

            const updatedCartProducts = await Promise.all(
                updatedUser.cart.map((productId: string) => ProductApi.getProductById(productId))
            );
            setCartItems(updatedCartProducts.filter((product) => product !== null) as Product[]);
        } catch (error) {
            console.error('Failed to remove product from cart:', error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const clearCart = async () => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        setIsLoading(true); // Start loading
        try {
            const userId = user.uid;
            const updatedUser = await UserApi.clearCart(userId);
            setCartItems([]);
            await AsyncStorage.removeItem('cartItems');
        } catch (error) {
            console.error('Failed to clear cart:', error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                isLoading // Expose loading state
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Add a useCart hook to make it easier to use the context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return  context;
};

export default CartProvider; // Add this line to ensure a default export

