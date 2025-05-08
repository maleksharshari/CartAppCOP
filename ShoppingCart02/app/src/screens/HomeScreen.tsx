import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import ProductApi, { Product } from '../api/ProductApi';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

// Define sort options type
type SortOption = {
    label: string;
    value: string;
};

// Sort options available to the user
const sortOptions: SortOption[] = [
    { label: 'Default', value: 'default' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A-Z', value: 'name-asc' },
    { label: 'Name: Z-A', value: 'name-desc' },
];

export default function HomeScreen({ navigation }: any) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCart();
    const { addToFavorites: addFavorite } = useFavorites();

    // New state for search and sort functionality
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Improved navigation function for Favorites
    const navigateToFavorites = () => {
        console.log('Attempting direct navigation to Favorites screen');

        try {
            // Use CommonActions for more reliable navigation
            navigation.dispatch(
                CommonActions.navigate({
                    name: 'Favorites',
                })
            );
            console.log('Navigation dispatch completed');
        } catch (error) {
            console.error('Navigation dispatch error:', error);
            Alert.alert('Navigation Error', 'Could not navigate to Favorites. Please try again.');
        }
    };

    // Handler to add product to cart
    const handleAddToCart = (product: Product, event: any) => {
        event.stopPropagation(); // Prevent navigation when clicking the button
        addToCart(product); // Add the product to the cart
        Alert.alert('Success', `${product.name} has been added to your cart!`);
    };

    // Handler to add product to favorites
    const handleAddToFavorites = (product: Product, event: any) => {
        event.stopPropagation(); // Prevent card navigation
        addFavorite(product);
        Alert.alert('Success', `${product.name} added to favorites!`);
    };

    // Filter and sort products whenever products, searchText, or sortBy changes
    useEffect(() => {
        if (products.length === 0) return;

        // First filter by search text
        let result = [...products];

        if (searchText) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Then apply sorting
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Default sorting (could be by ID or whatever the API returns)
                break;
        }

        setFilteredProducts(result);
    }, [products, searchText, sortBy]);

    useEffect(() => {
        let isMounted = true; // Track if the component is mounted
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await ProductApi.getAllProducts();
                if (isMounted) {
                    console.log('Products fetched:', data);
                    setProducts(data);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
                if (isMounted) {
                    setError('Failed to load products. Please try again.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        // Set up the logout button in the header
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            ),
        });

        return () => {
            isMounted = false; // Cleanup on unmount
        };
    }, [navigation]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            // Navigate to login screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleProductPress = (product: Product) => {
        console.log('Product pressed:', product);
        navigation.navigate('ProductDetails', { product });
    };

    // Handle search text changes
    const handleSearchChange = (text: string) => {
        setSearchText(text);
    };

    // Handle sorting option selection
    const handleSortChange = (option: string) => {
        setSortBy(option);
        setShowSortOptions(false);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#000000" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                        setError(null);
                        setProducts([]);
                        // Trigger a re-fetch by remounting
                        navigation.replace('Home');
                    }}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search and Sort UI */}
            <View style={styles.filterContainer}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        value={searchText}
                        onChangeText={handleSearchChange}
                    />
                    {searchText ? (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#888" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setShowSortOptions(!showSortOptions)}
                >
                    <Text style={styles.sortButtonText}>Sort</Text>
                    <Ionicons name="chevron-down" size={16} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Sort options dropdown */}
            {showSortOptions && (
                <View style={styles.sortOptionsContainer}>
                    {sortOptions.map(option => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.sortOption,
                                sortBy === option.value ? styles.selectedSortOption : null
                            ]}
                            onPress={() => handleSortChange(option.value)}
                        >
                            <Text style={sortBy === option.value ? styles.selectedSortOptionText : null}>
                                {option.label}
                            </Text>
                            {sortBy === option.value && (
                                <Ionicons name="checkmark" size={16} color="#000" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {filteredProducts.length === 0 && !loading ? (
                <View style={styles.centerContent}>
                    <Text style={styles.emptyText}>
                        {searchText ? 'No products match your search' : 'No products available'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.card}>
                            <Image
                                source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                                style={styles.image}
                            />
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.price}>${item.price.toFixed(2)}</Text>

                            {/* Quick action buttons */}
                            <View style={styles.quickActions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={(e) => handleAddToCart(item, e)} // Add to cart
                                >
                                    <Ionicons name="cart-outline" size={22} color="#000" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={(e) => handleAddToFavorites(item, e)} // Add to favorites
                                >
                                    <Ionicons name="heart-outline" size={22} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={{ paddingBottom: 70 }} // Add padding to avoid overlap with bottom nav
                />
            )}

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.navButtonTextActive}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate('Cart')}
                >
                    <Text style={styles.navButtonText}>Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navButton, styles.highlightButton]}
                    onPress={navigateToFavorites}
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
        backgroundColor: '#fff',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    // ... existing styles ...

    // New styles for search and sorting
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
        paddingHorizontal: 10,
        marginRight: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    sortButtonText: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
    sortOptionsContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedSortOption: {
        backgroundColor: '#f0f0f0',
    },
    selectedSortOptionText: {
        fontWeight: 'bold',
    },

    // ... keep all existing styles ...
    centerContent: { justifyContent: 'center', alignItems: 'center', flex: 1 },
    row: { justifyContent: 'space-between' },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
        width: '48%',
        position: 'relative',
    },
    image: { width: '100%', height: 150 },
    name: { fontSize: 16, fontWeight: 'bold', padding: 8 },
    price: { fontSize: 14, padding: 8, color: '#888' },
    loadingText: { marginTop: 10, fontSize: 16 },
    errorText: { color: 'red', fontSize: 16, marginBottom: 20, textAlign: 'center' },
    emptyText: { fontSize: 16, color: '#888' },
    retryButton: { backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 },
    retryText: { color: '#fff', fontSize: 16 },
    logoutButton: {
        marginRight: 15,
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        elevation: 2,
    },
    logoutText: { color: '#000', fontSize: 16, fontWeight: 'bold' },

    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },

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
    highlightButton: {
        backgroundColor: '#f0f0f0',
    },
});

