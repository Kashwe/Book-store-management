package com.bookstore.service;

import com.bookstore.dto.*;

public interface UserService {
    UserProfileResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    UserProfileResponse getProfile(String email);
    UserProfileResponse updateProfile(String email, UpdateProfileRequest request);
}
