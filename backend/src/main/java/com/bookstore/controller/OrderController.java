package com.bookstore.controller;

import com.bookstore.dto.OrderResponse;
import com.bookstore.entity.Order;
import com.bookstore.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Place Order
    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder(Principal principal) {
        OrderResponse response = orderService.placeOrder(principal.getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // View My Orders
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        List<Order> orders = orderService.getMyOrders(principal.getName());
        return ResponseEntity.ok(orders);
    }

    // Cancel Order
    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable String orderId,
            Principal principal) {

        OrderResponse response = orderService.cancelOrder(orderId, principal.getName());
        return ResponseEntity.ok(response);
    }
}