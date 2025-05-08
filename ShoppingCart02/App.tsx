import React from 'react';
import { AuthProvider } from './app/src/contexts/AuthContext';
import { CartProvider } from './app/src/contexts/CartContext';
import { FavoritesProvider } from './app/src/contexts/FavoritesContext';
import { ReviewProvider } from './app/src/contexts/ReviewContext';
import AppNavigator from './app/src/navigation/AppNavigator';

export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <FavoritesProvider>
                    <ReviewProvider>
                        <AppNavigator />
                    </ReviewProvider>
                </FavoritesProvider>
            </CartProvider>
        </AuthProvider>
    );
}
