package com.bookstore.controller;

import com.bookstore.dto.RatingRequest;
import com.bookstore.dto.RatingResponse;
import com.bookstore.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    // Add or Update Rating
    @PostMapping
    public ResponseEntity<RatingResponse> addOrUpdateRating(
            Principal principal,
            @Valid @RequestBody RatingRequest request) {

        RatingResponse response = ratingService.addOrUpdateRating(
                principal.getName(),
                request
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get Average Rating for a Book
    @GetMapping("/book/{bookId}/average")
    public ResponseEntity<Double> getAverageRating(
            @PathVariable String bookId) {

        return ResponseEntity.ok(
                ratingService.getAverageRating(bookId)
        );
    }

    // View My Ratings
    @GetMapping("/my-ratings")
    public ResponseEntity<List<RatingResponse>> getMyRatings(
            Principal principal) {

        return ResponseEntity.ok(
                ratingService.getMyRatings(principal.getName())
        );
    }
}