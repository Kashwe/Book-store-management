package com.bookstore.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
@CompoundIndex(def = "{'bookId': 1, 'userEmail': 1}", unique = true)
public class Review {

    @Id
    private String id;

    @Indexed
    private String bookId;

    private String userEmail;

    private String userName;

    private Integer rating;

    private String comment;

    private LocalDateTime createdAt;
}
