package com.bookstore.service;

import com.bookstore.dto.CartItemRequest;
import com.bookstore.dto.CartItemResponse;
import com.bookstore.dto.CartResponse;
import com.bookstore.dto.UpdateCartItemRequest;
import com.bookstore.entity.Book;
import com.bookstore.entity.Cart;
import com.bookstore.entity.CartItem;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;

    public CartServiceImpl(CartRepository cartRepository, BookRepository bookRepository) {
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
    }

    // US-010: Add to Cart
    @Override
    public CartResponse addToCart(String userEmail, CartItemRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + request.getBookId()));

        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseGet(() -> Cart.builder()
                        .userEmail(userEmail)
                        .items(new ArrayList<>())
                        .build());

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getBookId().equals(book.getId()))
                .findFirst()
                .orElse(null);

        int requestedQuantity = request.getQuantity() + (existingItem != null ? existingItem.getQuantity() : 0);

        if (requestedQuantity > book.getQuantity()) {
            throw new BadRequestException(
                    "Only " + book.getQuantity() + " unit(s) of \"" + book.getTitle() + "\" available in stock");
        }

        if (existingItem != null) {
            existingItem.setQuantity(requestedQuantity);
        } else {
            cart.getItems().add(CartItem.builder()
                    .bookId(book.getId())
                    .title(book.getTitle())
                    .price(book.getPrice())
                    .quantity(request.getQuantity())
                    .build());
        }

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    @Override
    public CartResponse getCart(String userEmail) {
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseGet(() -> Cart.builder().userEmail(userEmail).items(new ArrayList<>()).build());
        return mapToCartResponse(cart);
    }

    // Sets a cart line item to an exact quantity (used by the dashboard's +/- stepper)
    @Override
    public CartResponse updateItemQuantity(String userEmail, String bookId, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userEmail));

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getBookId().equals(bookId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in cart with book ID: " + bookId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + bookId));

        if (request.getQuantity() > book.getQuantity()) {
            throw new BadRequestException(
                    "Only " + book.getQuantity() + " unit(s) of \"" + book.getTitle() + "\" available in stock");
        }

        existingItem.setQuantity(request.getQuantity());

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    @Override
    public CartResponse removeItem(String userEmail, String bookId) {
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userEmail));

        boolean removed = cart.getItems().removeIf(item -> item.getBookId().equals(bookId));
        if (!removed) {
            throw new ResourceNotFoundException("Item not found in cart with book ID: " + bookId);
        }

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    @Override
    public void clearCart(String userEmail) {
        cartRepository.findByUserEmail(userEmail).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> CartItemResponse.builder()
                        .bookId(item.getBookId())
                        .title(item.getTitle())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getPrice() * item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        double total = itemResponses.stream()
                .mapToDouble(CartItemResponse::getSubtotal)
                .sum();

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .totalAmount(total)
                .build();
    }
}