package com.bookstore.service;

import com.bookstore.dto.CartItemRequest;
import com.bookstore.dto.CartResponse;
import com.bookstore.dto.UpdateCartItemRequest;

public interface CartService {

    // US-010: Add to Cart
    CartResponse addToCart(String userEmail, CartItemRequest request);

    CartResponse getCart(String userEmail);

    CartResponse removeItem(String userEmail, String bookId);

    // Sets a cart line item to an exact quantity (used by the dashboard's +/- stepper)
    CartResponse updateItemQuantity(String userEmail, String bookId, UpdateCartItemRequest request);

    void clearCart(String userEmail);
}
