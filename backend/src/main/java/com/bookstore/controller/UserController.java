package com.bookstore.controller;

import com.bookstore.dto.UpdateProfileRequest;
import com.bookstore.dto.UserProfileResponse;
import com.bookstore.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Profile", description = "BMS-US-003 / BMS-US-004 — Customer profile. Requires a logged-in token.")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "BMS-US-003: View your profile")
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Principal principal) {
        UserProfileResponse response = userService.getProfile(principal.getName());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "BMS-US-004: Update your profile", description = "Email cannot be changed — omit it or it will be ignored.")
    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(Principal principal,
                                                             @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse response = userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(response);
    }
}
