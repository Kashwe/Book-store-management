package com.bookstore.service;

import com.bookstore.dto.OrderItemResponse;
import com.bookstore.dto.OrderResponse;
import com.bookstore.entity.*;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;

    public OrderServiceImpl(CartRepository cartRepository, BookRepository bookRepository,
                             OrderRepository orderRepository) {
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
        this.orderRepository = orderRepository;
    }
@Override
public List<Order> getMyOrders(String userEmail) {
    return orderRepository.findByUserEmailOrderByOrderDateDesc(userEmail);
}

@Override
public OrderResponse cancelOrder(String orderId, String userEmail) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

    if (!order.getUserEmail().equals(userEmail)) {
        throw new BadRequestException("You are not authorized to cancel this order");
    }

    if (order.getStatus() == OrderStatus.CANCELLED) {
        throw new BadRequestException("Order is already cancelled");
    }

    // Restore stock
    for (OrderItem item : order.getItems()) {

        Book book = bookRepository.findById(item.getBookId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Book not found"));

        book.setQuantity(book.getQuantity() + item.getQuantity());

        bookRepository.save(book);
    }

    order.setStatus(OrderStatus.CANCELLED);

    Order updatedOrder = orderRepository.save(order);

    return mapToOrderResponse(updatedOrder);
} 
    // Place Order 
    @Override
    public OrderResponse placeOrder(String userEmail) {
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        List<OrderItem> orderItems = new ArrayList<>();

        // Validate stock for every item first, so the order either fully succeeds or fails
        for (CartItem cartItem : cart.getItems()) {
            Book book = bookRepository.findById(cartItem.getBookId())
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + cartItem.getBookId()));

            if (cartItem.getQuantity() > book.getQuantity()) {
                throw new BadRequestException(
                        "Only " + book.getQuantity() + " unit(s) of \"" + book.getTitle() + "\" available in stock");
            }
        }

        // Deduct stock and build order line items
        for (CartItem cartItem : cart.getItems()) {
            Book book = bookRepository.findById(cartItem.getBookId())
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + cartItem.getBookId()));

            book.setQuantity(book.getQuantity() - cartItem.getQuantity());
            bookRepository.save(book);

            orderItems.add(OrderItem.builder()
                    .bookId(cartItem.getBookId())
                    .title(cartItem.getTitle())
                    .price(cartItem.getPrice())
                    .quantity(cartItem.getQuantity())
                    .build());
        }

        double totalAmount = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        Order order = Order.builder()
                .userEmail(userEmail)
                .items(orderItems)
                .totalAmount(totalAmount)
                .status(OrderStatus.PLACED)
                .orderDate(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Empty the cart now that the order has been placed
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToOrderResponse(savedOrder);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .bookId(item.getBookId())
                        .title(item.getTitle())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getPrice() * item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .items(itemResponses)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .orderDate(order.getOrderDate())
                .build();
    }
}
