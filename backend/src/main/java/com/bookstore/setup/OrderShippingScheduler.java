package com.bookstore.setup;

import com.bookstore.entity.Order;
import com.bookstore.entity.OrderStatus;
import com.bookstore.repository.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class OrderShippingScheduler {

    private static final long AUTO_SHIP_AFTER_MINUTES = 30;

    private final OrderRepository orderRepository;

    public OrderShippingScheduler(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Auto-advance orders from PLACED to SHIPPED 30 minutes after they were placed
    @Scheduled(fixedRate = 60000)
    public void shipEligibleOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(AUTO_SHIP_AFTER_MINUTES);
        List<Order> eligible = orderRepository.findByStatusAndOrderDateBefore(OrderStatus.PLACED, cutoff);

        for (Order order : eligible) {
            order.setStatus(OrderStatus.SHIPPED);
            orderRepository.save(order);
        }
    }
}
