import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ProductApi } from '../api/ProductApi';
import UserApi from '../api/UserApi';
import { useAuth } from './AuthContext'; // Import useAuth instead of auth directly
import { AddToCartOrFavDto } from '../types/DTOs';

interface FavoritesContextType {
    favoriteItems: Product[];
    addToFavorites: (product: Product) => Promise<void>;
    removeFromFavorites: (productId: string) => Promise<void>;
    clearFavorites: () => Promise<void>; // Add this method
    isLoading: boolean; // Add loading state
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const { user, isLoading: authLoading } = useAuth(); // Get user and auth loading state

    // Only attempt to load favorites when auth is no longer loading
    useEffect(() => {
        if (authLoading) return; // Wait for auth to finish loading

        const loadFavorites = async () => {
            setIsLoading(true); // Start loading

            if (!user) {
                // User not logged in, but auth is done loading
                console.log('No authenticated user found');
                setFavoriteItems([]);
                setIsLoading(false);
                return;
            }

            try {
                const userId = user.uid;
                console.log('Loading favorites for user:', userId);

                // Fetch user by ID and get favorite product IDs
                const userData = await UserApi.getUserById(userId);
                if (userData && userData.favorites && userData.favorites.length > 0) {
                    console.log('User favorites data found:', userData.favorites);
                    // Fetch product details for each favorite product ID
                    const favoriteProducts = await Promise.all(
                        userData.favorites.map((productId: string) => ProductApi.getProductById(productId))
                    );
                    setFavoriteItems(favoriteProducts.filter((product) => product !== null) as Product[]);
                } else {
                    console.log('User has no favorites or favorites not initialized');
                    setFavoriteItems([]);
                }
            } catch (error) {
                console.error('Failed to load favorites:', error);
                setFavoriteItems([]);
            } finally {
                setIsLoading(false); // End loading regardless of outcome
            }
        };

        loadFavorites();

        return () => {
            setFavoriteItems([]); // Cleanup favorite items on unmount
        };
    }, [user, authLoading]); // Ensure dependencies are correct

    useEffect(() => {
        const saveFavorites = async () => {
            if (user) {
                try {
                    await AsyncStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
                } catch (error) {
                    console.error('Failed to save favorites to storage:', error);
                }
            }
        };

        saveFavorites();
    }, [favoriteItems, user]);

    const addToFavorites = async (product: Product) => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        setIsLoading(true); // Start loading
        try {
            const userId = user.uid;
            const dto: AddToCartOrFavDto = { userId, productId: product.id };
            console.log('Adding to favorites:', dto);

            const updatedUser = await UserApi.addToFavorites(dto);
            console.log('Updated user favorites:', updatedUser.favorites);

            const favoriteProducts = await Promise.all(
                updatedUser.favorites.map((productId: string) => ProductApi.getProductById(productId))
            );
            setFavoriteItems(favoriteProducts.filter((product) => product !== null) as Product[]);
        } catch (error) {
            console.error('Failed to add product to favorites:', error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const removeFromFavorites = async (productId: string) => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        setIsLoading(true); // Start loading
        try {
            const userId = user.uid;
            const dto: AddToCartOrFavDto = { userId, productId };
            const updatedUser = await UserApi.removeFromFavorites(dto);
            const favoriteProducts = await Promise.all(
                updatedUser.favorites.map((productId: string) => ProductApi.getProductById(productId))
            );
            setFavoriteItems(favoriteProducts.filter((product) => product !== null) as Product[]);
        } catch (error) {
            console.error('Failed to remove product from favorites:', error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const clearFavorites = async () => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        setIsLoading(true); // Start loading
        try {
            const userId = user.uid;
            const updatedUser = await UserApi.clearFavorites(userId);
            setFavoriteItems([]);
            await AsyncStorage.removeItem('favoriteItems');
        } catch (error) {
            console.error('Failed to clear favorites:', error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <FavoritesContext.Provider value={{
            favoriteItems,
            addToFavorites,
            removeFromFavorites,
            clearFavorites, // Add this method to the provider
            isLoading // Expose loading state
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

// Add a useFavorites hook to make it easier to use the context
export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};

export default FavoritesProvider; // Add this line to ensure a default export
