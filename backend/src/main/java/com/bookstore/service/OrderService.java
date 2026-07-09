package com.bookstore.service;

import com.bookstore.dto.OrderResponse;
import com.bookstore.entity.Order;

import java.util.List;

public interface OrderService {

    // Place Order
    OrderResponse placeOrder(String userEmail);

    // View Orders
    List<Order> getMyOrders(String userEmail);
}