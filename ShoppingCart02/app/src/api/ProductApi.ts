import { ProductDto } from '../types/DTOs';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
}

export { ProductDto };

export class ProductApi {
    static async getAllProducts(): Promise<Product[]> {
        try {
            const response = await axios.get(`${API_URL}`);
            return response.data as Product[];
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    static async getProductById(id: string): Promise<ProductDto | null> {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with ID ${id}:`, error);
            return null;
        }
    }

}

export default ProductApi;
