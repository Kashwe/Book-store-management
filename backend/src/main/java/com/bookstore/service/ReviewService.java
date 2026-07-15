package com.bookstore.service;

import com.bookstore.dto.ReviewRequest;
import com.bookstore.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {

    // BMS-US-014 / BMS-US-015: Add Review & Rate Book
    ReviewResponse addReview(String userEmail, String bookId, ReviewRequest request);

    // BMS-US-016: View Reviews
    List<ReviewResponse> getReviewsForBook(String bookId);
}
