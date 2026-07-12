package com.bookstore.service;

import com.bookstore.dto.ReviewRequest;
import com.bookstore.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {

    // Add Review
    ReviewResponse addReview(String userEmail, ReviewRequest request);

    // View Reviews for a Book
    List<ReviewResponse> getReviewsByBook(String bookId);

    // View My Reviews
    List<ReviewResponse> getMyReviews(String userEmail);
}