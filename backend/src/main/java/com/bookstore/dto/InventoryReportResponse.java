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
public class InventoryReportResponse {
    private Long totalTitles;
    private Long totalUnitsInStock;
    private Double totalInventoryValue;
    private List<LowStockBookResponse> lowStockBooks;
}
