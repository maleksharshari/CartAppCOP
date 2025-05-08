import axios from 'axios';
import { CreateUserDto, UserDto , AddToCartOrFavDto } from '../types/DTOs';

const API_URL = 'http://localhost:8080/api/users';


class UserApi {


    static async getUserById(id: string): Promise<UserDto | null> {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user with ID ${id}:`, error);
            return null;
        }
    }

    static async createUser(userDto: CreateUserDto): Promise<UserDto> {
        try {
            const response = await axios.post(`${API_URL}/create`, userDto); // Post to /create endpoint
            console.log('Created user:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Returns the updated user with added cart item
    static async addToCart(dto: AddToCartOrFavDto): Promise<UserDto> {
        try {
            const response = await axios.post(`${API_URL}/add/cart`, dto);
            return response.data;
        } catch (error) {
            console.error(`Error adding product to cart for user ${dto.userId}:`, error);
            throw error;
        }
    }

    // Returns the updated user with removed cart item
    static async removeFromCart(dto: AddToCartOrFavDto): Promise<UserDto> {
        try {
            const response = await axios.delete(`${API_URL}/remove/cart`, { data: dto });
            return response.data;
        } catch (error) {
            console.error(`Error removing product from cart for user ${dto.userId}:`, error);
            throw error;
        }
    }

    // Returns the updated user with added favorite
    static async addToFavorites(dto: AddToCartOrFavDto): Promise<UserDto> {
        try {
            const response = await axios.post(`${API_URL}/add/favorite`, dto);
            return response.data;
        } catch (error) {
            console.error(`Error adding product to favorites for user ${dto.userId}:`, error);
            throw error;
        }
    }

    // Returns the updated user with removed favorite
    static async removeFromFavorites(dto: AddToCartOrFavDto): Promise<UserDto> {
        try {
            const response = await axios.delete(`${API_URL}/remove/favorite`, { data: dto });
            return response.data;
        } catch (error) {
            console.error(`Error removing product from favorites for user ${dto.userId}:`, error);
            throw error;
        }
    }

    // Clears all favorites for the user
    static async clearFavorites(userId: string): Promise<any> {
        try {
            const response = await axios.delete(`${API_URL}/${userId}/favorites/clear`);
            return response.data;
        } catch (error) {
            console.error('Error clearing favorites for user', userId, ':', error);
            throw error;
        }
    }

    // Clears all items in the cart for the user
    static async clearCart(userId: string): Promise<any> {
        try {
            const response = await axios.delete(`${API_URL}/${userId}/cart/clear`);
            return response.data;
        } catch (error) {
            console.error('Error clearing cart for user', userId, ':', error);
            throw error;
        }
    }
}

export default UserApi;

