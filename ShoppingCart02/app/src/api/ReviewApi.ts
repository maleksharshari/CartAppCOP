import axios from 'axios';
import { ReviewDto, ReviewCreateDto } from '../types/DTOs';

const API_URL = 'http://localhost:8080/api/reviews';

class ReviewApi {


    static async getReviewsByProductId(productId: string): Promise<ReviewDto[]> {
        try {
            const response = await axios.get(`${API_URL}/product/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reviews for product ${productId}:`, error);
            throw error;
        }
    }

    static async getReviewById(reviewId: string): Promise<ReviewDto> {
        try {
            const response = await axios.get(`${API_URL}/${reviewId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching review with id ${reviewId}:`, error);
            throw error;
        }
    }


    static async createReview(reviewCreateDto: ReviewCreateDto): Promise<ReviewDto> {
        try {
            const response = await axios.post(
                `${API_URL}/create`,
                reviewCreateDto
            );
            return response.data;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    }
}


export default ReviewApi;
