package com.bookstore.service;

import com.bookstore.dto.CheckoutRequest;
import com.bookstore.dto.OrderResponse;

import java.util.List;

public interface OrderService {

    //  Place Order
    OrderResponse placeOrder(String userEmail, CheckoutRequest request);

    // BMS-US-012: View Order History
    List<OrderResponse> getOrdersForUser(String userEmail);

    // BMS-US-013: Cancel Order
    OrderResponse cancelOrder(String userEmail, String orderId);
}
