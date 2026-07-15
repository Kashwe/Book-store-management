package com.bookstore.controller;

import com.bookstore.dto.InventoryReportResponse;
import com.bookstore.dto.SalesReportResponse;
import com.bookstore.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "BMS-US-017 / BMS-US-018 — Admin-only sales & inventory reports. Requires an Admin token (customer tokens get 403).")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @Operation(summary = "BMS-US-018: Sales / order report (Admin only)",
            description = "Revenue, order counts, and top-selling books across PLACED + SHIPPED orders (CANCELLED excluded).")
    @GetMapping("/sales")
    public ResponseEntity<SalesReportResponse> getSalesReport() {
        return ResponseEntity.ok(reportService.getSalesReport());
    }

    @Operation(summary = "BMS-US-017: Book inventory report (Admin only)",
            description = "Stock levels, total inventory value, and low-stock alerts (quantity <= 5).")
    @GetMapping("/inventory")
    public ResponseEntity<InventoryReportResponse> getInventoryReport() {
        return ResponseEntity.ok(reportService.getInventoryReport());
    }
}
