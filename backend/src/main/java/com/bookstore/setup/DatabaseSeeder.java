package com.bookstore.setup;

import com.bookstore.entity.Role;
import com.bookstore.entity.User;
import com.bookstore.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin user if email does not exist in the collection
        String adminEmail = "admin@bookstore.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name("Store Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123")) // password is 'admin123'
                    .phone("9999999999")
                    .address("Admin HQ, BookStore System Office")
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);
            System.out.println(">>> Database Seeded: Default Admin User created [Email: admin@bookstore.com, Password: admin123]");
        } else {
            System.out.println(">>> Database Seeder: Admin User already exists. Skipping seeding.");
        }
    }
}
