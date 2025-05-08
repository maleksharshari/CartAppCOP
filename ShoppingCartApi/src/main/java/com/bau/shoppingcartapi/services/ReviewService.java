package com.bau.shoppingcartapi.services;

import com.bau.shoppingcartapi.dto.ProductDto;
import com.bau.shoppingcartapi.dto.ReviewCreateDto;
import com.bau.shoppingcartapi.dto.ReviewDto;
import com.bau.shoppingcartapi.entities.Product;
import com.bau.shoppingcartapi.entities.Review;
import com.bau.shoppingcartapi.entities.User;
import com.bau.shoppingcartapi.repositories.ProductRepository;
import com.bau.shoppingcartapi.repositories.ReviewRepository;
import com.bau.shoppingcartapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;


    public List<ReviewDto> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        List<ReviewDto> reviewDtos = reviews.stream()
                .map(review -> new ReviewDto(
                        review.getId(),
                        review.getComment(),
                        review.getUserId(),
                        review.getProductId()
                ))
                .collect(Collectors.toList());
        return reviewDtos;
    }


    public ReviewDto getReviewDtoById(String id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        ReviewDto dto = new ReviewDto();
        dto.setComment(review.getComment());
        dto.setUserId(review.getUserId());
        dto.setProductId(review.getProductId());
        return dto;
    }

    public List<ReviewDto> getReviewsByProductId(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return reviewRepository.findByProductId(productId).stream()
                .map(review -> {
                    ReviewDto dto = new ReviewDto();
                    dto.setComment(review.getComment());
                    dto.setUserId(review.getUserId());
                    dto.setProductId(productId);
                    return dto;
                })
                .collect(Collectors.toList());
    }


    public ReviewDto createReviewAndReturnDto(ReviewCreateDto reviewDto) {
        // Validate user exists
        User user = userRepository.findById(reviewDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(reviewDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Create new review
        Review review = new Review();
        review.setUserId(reviewDto.getUserId());
        review.setProductId(reviewDto.getProductId());
        review.setComment(reviewDto.getComment());

        // Save review
        Review createdReview = reviewRepository.save(review);

        // Map to DTO
        ReviewDto responseDto = new ReviewDto();
        responseDto.setComment(createdReview.getComment());
        responseDto.setUserId(createdReview.getUserId());
        responseDto.setProductId(createdReview.getProductId());

        return responseDto;
    }


}
