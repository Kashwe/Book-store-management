package com.bookstore.config;

import com.bookstore.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(
            JwtFilter jwtFilter,
            CustomUserDetailsService userDetailsService
    ) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // Disable CSRF because this is a stateless JWT REST API
            .csrf(csrf -> csrf.disable())

            // Enable CORS for React frontend
            .cors(cors ->
                cors.configurationSource(corsConfigurationSource())
            )

            // JWT authentication is stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // API authorization rules
            .authorizeHttpRequests(auth -> auth

                // ==============================
                // US-001 / US-002
                // Register and Login
                // Public APIs
                // ==============================
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // ==============================
                // Swagger UI / OpenAPI
                // Public for API testing
                // ==============================
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs",
                    "/v3/api-docs/**"
                ).permitAll()

                // ==============================
                // US-008 / US-009
                // View Books and Search Books
                // Public
                // ==============================
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/books",
                    "/api/books/search",
                    "/api/books/**"
                ).permitAll()

                // ==============================
                // US-005
                // Add Book
                // Admin only
                // ==============================
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/books"
                ).hasRole("ADMIN")

                // ==============================
                // US-006
                // Update Book
                // Admin only
                // ==============================
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/books/**"
                ).hasRole("ADMIN")

                // ==============================
                // US-007
                // Delete Book
                // Admin only
                // ==============================
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/books/**"
                ).hasRole("ADMIN")

                // ==============================
                // US-010
                // Cart
                // Logged-in user required
                // ==============================
                .requestMatchers(
                    "/api/cart/**"
                ).authenticated()

                // ==============================
                // US-011
                // Orders
                // Logged-in user required
                // ==============================
                .requestMatchers(
                    "/api/orders/**"
                ).authenticated()

                // ==============================
                // All remaining APIs
                // Login required
                // Includes profile APIs
                // ==============================
                .anyRequest().authenticated()
            )

            // Custom authentication provider
            .authenticationProvider(
                authenticationProvider()
            )

            // JWT filter before Spring username/password filter
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // React / Vite frontend URLs
        configuration.setAllowedOrigins(
            List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            )
        );

        // Allowed HTTP methods
        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
            )
        );

        // Headers frontend can send
        configuration.setAllowedHeaders(
            List.of(
                "Authorization",
                "Content-Type"
            )
        );

        // Headers frontend can read
        configuration.setExposedHeaders(
            List.of(
                "Authorization"
            )
        );

        // Allow credentials
        configuration.setAllowCredentials(true);

        // Apply CORS configuration to all endpoints
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(
            userDetailsService
        );

        authProvider.setPasswordEncoder(
            passwordEncoder()
        );

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
