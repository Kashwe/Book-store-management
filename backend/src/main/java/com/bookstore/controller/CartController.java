package com.bookstore.controller;

import com.bookstore.dto.CartItemRequest;
import com.bookstore.dto.CartResponse;
import com.bookstore.dto.UpdateCartItemRequest;
import com.bookstore.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart", description = "BMS-US-010 — Shopping cart. Requires a logged-in token.")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @Operation(summary = "BMS-US-010: Add a book to your cart",
            description = "Adds on top of any existing quantity for that book — calling it twice with quantity=1 results in 2 in the cart.")
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(Principal principal,
                                                   @Valid @RequestBody CartItemRequest request) {
        CartResponse response = cartService.addToCart(principal.getName(), request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "View your current cart")
    @GetMapping
    public ResponseEntity<CartResponse> getCart(Principal principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getName()));
    }

    @Operation(summary = "Remove a book entirely from your cart")
    @DeleteMapping("/item/{bookId}")
    public ResponseEntity<CartResponse> removeItem(Principal principal, @PathVariable String bookId) {
        return ResponseEntity.ok(cartService.removeItem(principal.getName(), bookId));
    }

    @Operation(summary = "Set an exact quantity for a cart item",
            description = "Unlike /add, this REPLACES the quantity rather than adding to it. Quantity must be >= 1 — to remove the item, use the DELETE endpoint instead.")
    @PutMapping("/item/{bookId}")
    public ResponseEntity<CartResponse> updateItemQuantity(Principal principal, @PathVariable String bookId,
                                                            @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItemQuantity(principal.getName(), bookId, request));
    }

    @Operation(summary = "Empty your entire cart")
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
        return ResponseEntity.noContent().build();
    }
}
