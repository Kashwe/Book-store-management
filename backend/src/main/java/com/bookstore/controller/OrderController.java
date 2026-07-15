package com.bookstore.controller;

import com.bookstore.dto.CheckoutRequest;
import com.bookstore.dto.OrderResponse;
import com.bookstore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "BMS-US-011 to BMS-US-013 — Checkout, order history & cancellation. Requires a logged-in token.")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @Operation(summary = "BMS-US-011: Place an order from your cart",
            description = "Your cart must have at least one item first (POST /api/cart/add). Requires shipping phone, address, and paymentMethod (COD or UPI). Empties the cart and decrements book stock on success. Orders auto-advance from PLACED to SHIPPED 30 minutes after being placed.")
    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder(Principal principal, @Valid @RequestBody CheckoutRequest request) {
        OrderResponse response = orderService.placeOrder(principal.getName(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "BMS-US-012: View your order history")
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(Principal principal) {
        return ResponseEntity.ok(orderService.getOrdersForUser(principal.getName()));
    }

    @Operation(summary = "BMS-US-013: Cancel an order",
            description = "Only orders still in PLACED status can be cancelled — once SHIPPED, this returns 400. Cancelling restocks the ordered books.")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(Principal principal, @PathVariable String id) {
        return ResponseEntity.ok(orderService.cancelOrder(principal.getName(), id));
    }
}
