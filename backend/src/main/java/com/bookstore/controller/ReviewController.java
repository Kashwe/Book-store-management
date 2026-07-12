package com.bookstore.controller;

import com.bookstore.dto.ReviewRequest;
import com.bookstore.dto.ReviewResponse;
import com.bookstore.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Add Review
    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            Principal principal,
            @Valid @RequestBody ReviewRequest request) {

        ReviewResponse response =
                reviewService.addReview(principal.getName(), request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // View Reviews for a Book
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByBook(
            @PathVariable String bookId) {

        return ResponseEntity.ok(
                reviewService.getReviewsByBook(bookId)
        );
    }

    // View My Reviews
    @GetMapping("/my-reviews")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(
            Principal principal) {

        return ResponseEntity.ok(
                reviewService.getMyReviews(principal.getName())
        );
    }
}