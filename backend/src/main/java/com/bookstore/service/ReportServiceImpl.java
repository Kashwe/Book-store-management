package com.bookstore.service;

import com.bookstore.dto.InventoryReportResponse;
import com.bookstore.dto.LowStockBookResponse;
import com.bookstore.dto.SalesReportResponse;
import com.bookstore.dto.TopSellingBookResponse;
import com.bookstore.entity.Book;
import com.bookstore.entity.Order;
import com.bookstore.entity.OrderItem;
import com.bookstore.entity.OrderStatus;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private static final int LOW_STOCK_THRESHOLD = 5;
    private static final int TOP_SELLING_LIMIT = 5;

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;

    public ReportServiceImpl(OrderRepository orderRepository, BookRepository bookRepository) {
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
    }

    // BMS-US-017: Sales Report
    @Override
    public SalesReportResponse getSalesReport() {
        List<Order> allOrders = orderRepository.findAll();

        // PLACED and SHIPPED orders both represent completed sales; only CANCELLED is excluded
        List<Order> validOrders = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        long cancelledCount = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.CANCELLED)
                .count();

        double totalRevenue = validOrders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();

        long totalBooksSold = validOrders.stream()
                .flatMap(o -> o.getItems().stream())
                .mapToLong(OrderItem::getQuantity)
                .sum();

        Map<String, TopSellingBookResponse> byBook = new LinkedHashMap<>();
        for (Order order : validOrders) {
            for (OrderItem item : order.getItems()) {
                TopSellingBookResponse existing = byBook.get(item.getBookId());
                if (existing == null) {
                    byBook.put(item.getBookId(), TopSellingBookResponse.builder()
                            .bookId(item.getBookId())
                            .title(item.getTitle())
                            .quantitySold(item.getQuantity())
                            .revenue(item.getPrice() * item.getQuantity())
                            .build());
                } else {
                    existing.setQuantitySold(existing.getQuantitySold() + item.getQuantity());
                    existing.setRevenue(existing.getRevenue() + (item.getPrice() * item.getQuantity()));
                }
            }
        }

        List<TopSellingBookResponse> topSellingBooks = byBook.values().stream()
                .sorted(Comparator.comparingInt(TopSellingBookResponse::getQuantitySold).reversed())
                .limit(TOP_SELLING_LIMIT)
                .collect(Collectors.toList());

        return SalesReportResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders((long) validOrders.size())
                .totalCancelledOrders(cancelledCount)
                .totalBooksSold(totalBooksSold)
                .topSellingBooks(topSellingBooks)
                .build();
    }

    // BMS-US-018: Inventory Report
    @Override
    public InventoryReportResponse getInventoryReport() {
        List<Book> allBooks = bookRepository.findAll();

        long totalUnitsInStock = allBooks.stream()
                .mapToLong(Book::getQuantity)
                .sum();

        double totalInventoryValue = allBooks.stream()
                .mapToDouble(b -> b.getPrice() * b.getQuantity())
                .sum();

        List<LowStockBookResponse> lowStockBooks = allBooks.stream()
                .filter(b -> b.getQuantity() <= LOW_STOCK_THRESHOLD)
                .sorted(Comparator.comparingInt(Book::getQuantity))
                .map(b -> LowStockBookResponse.builder()
                        .bookId(b.getId())
                        .title(b.getTitle())
                        .quantity(b.getQuantity())
                        .build())
                .collect(Collectors.toList());

        return InventoryReportResponse.builder()
                .totalTitles((long) allBooks.size())
                .totalUnitsInStock(totalUnitsInStock)
                .totalInventoryValue(totalInventoryValue)
                .lowStockBooks(lowStockBooks)
                .build();
    }
}
