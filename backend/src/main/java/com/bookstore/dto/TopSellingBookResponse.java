package com.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopSellingBookResponse {
    private String bookId;
    private String title;
    private Integer quantitySold;
    private Double revenue;
}
