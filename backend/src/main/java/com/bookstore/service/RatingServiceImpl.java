package com.bookstore.service;

import com.bookstore.dto.RatingRequest;
import com.bookstore.dto.RatingResponse;
import com.bookstore.entity.Rating;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.RatingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final BookRepository bookRepository;

    public RatingServiceImpl(RatingRepository ratingRepository,
                             BookRepository bookRepository) {
        this.ratingRepository = ratingRepository;
        this.bookRepository = bookRepository;
    }

    // Add or Update Rating
    @Override
    public RatingResponse addOrUpdateRating(
            String userEmail,
            RatingRequest request) {

        if (!bookRepository.existsById(request.getBookId())) {
            throw new ResourceNotFoundException("Book not found");
        }

        Rating rating = ratingRepository
                .findByBookIdAndUserEmail(
                        request.getBookId(),
                        userEmail)
                .orElse(
                        Rating.builder()
                                .bookId(request.getBookId())
                                .userEmail(userEmail)
                                .build()
                );

        rating.setRating(request.getRating());
        rating.setRatingDate(LocalDateTime.now());

        Rating savedRating = ratingRepository.save(rating);

        return mapToRatingResponse(savedRating);
    }

    // Get Average Rating
    @Override
    public Double getAverageRating(String bookId) {

        if (!bookRepository.existsById(bookId)) {
            throw new ResourceNotFoundException("Book not found");
        }

        List<Rating> ratings =
                ratingRepository.findByBookId(bookId);

        if (ratings.isEmpty()) {
            return 0.0;
        }

        return ratings.stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);
    }

    // View My Ratings
    @Override
    public List<RatingResponse> getMyRatings(String userEmail) {

        return ratingRepository
                .findByUserEmail(userEmail)
                .stream()
                .map(this::mapToRatingResponse)
                .collect(Collectors.toList());
    }

    // Convert Rating Entity to RatingResponse
    private RatingResponse mapToRatingResponse(Rating rating) {

        return RatingResponse.builder()
                .id(rating.getId())
                .bookId(rating.getBookId())
                .userEmail(rating.getUserEmail())
                .rating(rating.getRating())
                .ratingDate(rating.getRatingDate())
                .build();
    }
}