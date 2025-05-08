package com.bau.shoppingcartapi.controllers;

import com.bau.shoppingcartapi.dto.ProductDto;
import com.bau.shoppingcartapi.dto.ReviewCreateDto;
import com.bau.shoppingcartapi.dto.ReviewDto;
import com.bau.shoppingcartapi.entities.Review;
import com.bau.shoppingcartapi.services.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        List<ReviewDto> reviewDtos = reviewService.getAllReviews();
        return ResponseEntity.ok(reviewDtos);
    }


    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getReviewsByProductId(@PathVariable @Valid String productId) {
        List<ReviewDto> reviewDtos = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviewDtos);
    }


    @PostMapping("/create")
    public ResponseEntity<ReviewDto> createReview(@RequestBody ReviewCreateDto reviewCreateDto) {
        ReviewDto responseDto = reviewService.createReviewAndReturnDto(reviewCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDto> getReviewById(@PathVariable String id) {
        ReviewDto reviewDto = reviewService.getReviewDtoById(id);
        return ResponseEntity.ok(reviewDto);
    }

}
