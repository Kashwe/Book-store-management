package com.bookstore.controller;

import com.bookstore.dto.CartItemRequest;
import com.bookstore.dto.CartResponse;
import com.bookstore.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // BMS-US-010: Add to Cart
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(Principal principal,
                                                   @Valid @RequestBody CartItemRequest request) {
        CartResponse response = cartService.addToCart(principal.getName(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Principal principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getName()));
    }

    @DeleteMapping("/item/{bookId}")
    public ResponseEntity<CartResponse> removeItem(Principal principal, @PathVariable String bookId) {
        return ResponseEntity.ok(cartService.removeItem(principal.getName(), bookId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
        return ResponseEntity.noContent().build();
    }
}
