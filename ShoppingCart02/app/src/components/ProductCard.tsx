import React from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../api/ProductApi';

interface ProductCardProps {
    product: Product;
    onPress: () => void;
    onAddToCart: () => void;
    onAddToFavorites: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onAddToCart, onAddToFavorites }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Image source={{ uri: product.imageUrl || 'https://via.placeholder.com/150' }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={styles.actions}>
                <Button title="Add to Cart" onPress={onAddToCart} />
                <Button title="Favorite" onPress={onAddToFavorites} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { marginBottom: 16, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd', padding: 8 },
    image: { width: '100%', height: 150, borderRadius: 8 },
    name: { fontSize: 16, fontWeight: 'bold', marginVertical: 8 },
    price: { fontSize: 14, marginBottom: 8, color: '#888' },
    actions: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default ProductCard;
