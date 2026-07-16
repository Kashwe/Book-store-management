package com.bookstore.service;

import com.bookstore.dto.InventoryReportResponse;
import com.bookstore.dto.SalesReportResponse;

public interface ReportService {

    // BMS-US-017: Sales Report — Admin only
    SalesReportResponse getSalesReport();

    // BMS-US-018: Inventory Report — Admin only
    InventoryReportResponse getInventoryReport();
}
