package com.bookstore.controller;

import com.bookstore.dto.OrderResponse;
import com.bookstore.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    //  Place Order
    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder(Principal principal) {
        OrderResponse response = orderService.placeOrder(principal.getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
