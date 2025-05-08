import React, { createContext, useContext, useState, ReactNode } from 'react';
import ReviewApi from '../api/ReviewApi';
import { ReviewDto, ReviewCreateDto } from '../types/DTOs';

interface ReviewContextType {
  reviews: ReviewDto[];
  loading: boolean;
  error: string | null;
  fetchReviewsByProductId: (productId: string) => Promise<void>;
  createReview: (reviewData: ReviewCreateDto) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

interface ReviewProviderProps {
  children: ReactNode;
}

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ children }) => {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewsByProductId = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedReviews = await ReviewApi.getReviewsByProductId(productId);
      setReviews(fetchedReviews);
    } catch (error: any) {
      setError('Failed to fetch reviews: ' + (error.message || 'Unknown error'));
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: ReviewCreateDto) => {
    setLoading(true);
    setError(null);
    try {
      const newReview = await ReviewApi.createReview(reviewData);
      setReviews(prevReviews => [...prevReviews, newReview]);
    } catch (error: any) {
      setError('Failed to create review: ' + (error.message || 'Unknown error'));
      console.error('Error creating review:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    reviews,
    loading,
    error,
    fetchReviewsByProductId,
    createReview,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

export default ReviewProvider;
