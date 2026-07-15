package com.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportResponse {
    private Double totalRevenue;
    private Long totalOrders;
    private Long totalCancelledOrders;
    private Long totalBooksSold;
    private List<TopSellingBookResponse> topSellingBooks;
}
