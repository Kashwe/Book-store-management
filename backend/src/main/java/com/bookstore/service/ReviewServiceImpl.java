package com.bookstore.service;

import com.bookstore.dto.ReviewRequest;
import com.bookstore.dto.ReviewResponse;
import com.bookstore.entity.Review;
import com.bookstore.entity.User;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.ReviewRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, BookRepository bookRepository,
                              UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    // BMS-US-014 / BMS-US-015: Add Review & Rate Book
    @Override
    public ReviewResponse addReview(String userEmail, String bookId, ReviewRequest request) {
        bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + bookId));

        reviewRepository.findByBookIdAndUserEmail(bookId, userEmail)
                .ifPresent(existing -> {
                    throw new BadRequestException("You have already reviewed this book");
                });

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Review review = Review.builder()
                .bookId(bookId)
                .userEmail(userEmail)
                .userName(user.getName())
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapToReviewResponse(savedReview);
    }

    // BMS-US-016: View Reviews
    @Override
    public List<ReviewResponse> getReviewsForBook(String bookId) {
        bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + bookId));

        return reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId)
                .stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .bookId(review.getBookId())
                .userName(review.getUserName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
