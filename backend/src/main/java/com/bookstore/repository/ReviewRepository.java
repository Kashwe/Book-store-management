package com.bookstore.repository;

import com.bookstore.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByBookIdOrderByCreatedAtDesc(String bookId);
    Optional<Review> findByBookIdAndUserEmail(String bookId, String userEmail);
}
