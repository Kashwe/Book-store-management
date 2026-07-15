package com.bookstore.controller;

import com.bookstore.dto.ReviewRequest;
import com.bookstore.dto.ReviewResponse;
import com.bookstore.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/books/{bookId}/reviews")
@Tag(name = "Reviews", description = "BMS-US-014 to BMS-US-016 — Reviews & ratings. GET is public; POST requires a logged-in token.")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @Operation(summary = "BMS-US-014 / BMS-US-015: Add a review + rating",
            description = "Rating must be 1-5. Each user can only review a given book once — a second attempt returns 400.")
    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(Principal principal,
                                                      @PathVariable String bookId,
                                                      @Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.addReview(principal.getName(), bookId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "BMS-US-016: View all reviews for a book (public)")
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable String bookId) {
        return ResponseEntity.ok(reviewService.getReviewsForBook(bookId));
    }
}
