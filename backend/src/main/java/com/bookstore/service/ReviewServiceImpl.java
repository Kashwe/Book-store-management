package com.bookstore.service;

import com.bookstore.dto.ReviewRequest;
import com.bookstore.dto.ReviewResponse;
import com.bookstore.entity.Review;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                             BookRepository bookRepository) {
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
    }

    // Add Review
    @Override
    public ReviewResponse addReview(String userEmail, ReviewRequest request) {

        if (!bookRepository.existsById(request.getBookId())) {
            throw new ResourceNotFoundException("Book not found");
        }

        Review review = Review.builder()
                .bookId(request.getBookId())
                .userEmail(userEmail)
                .comment(request.getComment())
                .reviewDate(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);

        return mapToReviewResponse(savedReview);
    }

    // View Reviews for a Book
    @Override
    public List<ReviewResponse> getReviewsByBook(String bookId) {

        if (!bookRepository.existsById(bookId)) {
            throw new ResourceNotFoundException("Book not found");
        }

        return reviewRepository
                .findByBookIdOrderByReviewDateDesc(bookId)
                .stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    // View My Reviews
    @Override
    public List<ReviewResponse> getMyReviews(String userEmail) {

        return reviewRepository
                .findByUserEmail(userEmail)
                .stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToReviewResponse(Review review) {

        return ReviewResponse.builder()
                .id(review.getId())
                .bookId(review.getBookId())
                .userEmail(review.getUserEmail())
                .comment(review.getComment())
                .reviewDate(review.getReviewDate())
                .build();
    }
}