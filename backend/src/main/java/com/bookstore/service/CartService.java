package com.bookstore.service;

import com.bookstore.dto.CartItemRequest;
import com.bookstore.dto.CartResponse;

public interface CartService {

    // US-010: Add to Cart
    CartResponse addToCart(String userEmail, CartItemRequest request);

    CartResponse getCart(String userEmail);

    CartResponse removeItem(String userEmail, String bookId);

    void clearCart(String userEmail);
}
