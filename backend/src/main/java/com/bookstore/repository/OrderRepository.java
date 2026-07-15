package com.bookstore.repository;

import com.bookstore.entity.Order;
import com.bookstore.entity.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserEmailOrderByOrderDateDesc(String userEmail);
    List<Order> findByStatusAndOrderDateBefore(OrderStatus status, LocalDateTime cutoff);
}