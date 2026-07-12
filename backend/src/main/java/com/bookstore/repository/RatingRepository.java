package com.bookstore.repository;

import com.bookstore.entity.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {

    // Find customer's rating for a specific book
    Optional<Rating> findByBookIdAndUserEmail(String bookId, String userEmail);

    // Get all ratings for a book
    List<Rating> findByBookId(String bookId);

    // Get customer's ratings
    List<Rating> findByUserEmail(String userEmail);
}