package com.bookstore.controller;

import com.bookstore.dto.LoginRequest;
import com.bookstore.dto.LoginResponse;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.dto.UserProfileResponse;
import com.bookstore.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "BMS-US-001 / BMS-US-002 — Registration & Login. Public, no token required.")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "BMS-US-001: Register a new customer account",
            description = "Creates a CUSTOMER account. All new registrations get role CUSTOMER — admin accounts are seeded separately.")
    @PostMapping("/register")
    public ResponseEntity<UserProfileResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserProfileResponse response = userService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "BMS-US-002: Log in and receive a JWT",
            description = "Returns a bearer token — copy it and click the Authorize button above (as 'Bearer <token>') to call protected endpoints below.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
}
