package com.bookstore.service;

import com.bookstore.dto.OrderResponse;

public interface OrderService {

    //  Place Order 
    OrderResponse placeOrder(String userEmail);
}
