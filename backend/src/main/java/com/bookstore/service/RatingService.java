package com.bookstore.service;

import com.bookstore.dto.RatingRequest;
import com.bookstore.dto.RatingResponse;

import java.util.List;

public interface RatingService {

    // Add or Update Rating
    RatingResponse addOrUpdateRating(
            String userEmail,
            RatingRequest request
    );

    // Get Average Rating for a Book
    Double getAverageRating(String bookId);

    // View My Ratings
    List<RatingResponse> getMyRatings(String userEmail);
}