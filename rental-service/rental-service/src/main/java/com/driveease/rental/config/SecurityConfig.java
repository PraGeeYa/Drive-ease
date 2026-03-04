package com.driveease.rental.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

/**
 * SecurityConfig - Central security configuration for DriveEase.
 * This class defines who can access which API endpoints and how authentication is handled.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    // Injecting the custom JWT filter to process tokens
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    /**
     * SECURITY FILTER CHAIN
     * This is the core method where we define the security rules for the system.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF: Not needed for stateless REST APIs using JWT
                .csrf(csrf -> csrf.disable())

                // 2. CORS Configuration: Allows our React frontend (port 3000) to communicate with this backend
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration cfg = new CorsConfiguration();
                    cfg.setAllowedOrigins(List.of("http://localhost:3000")); // React App URL
                    cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                    cfg.setAllowedHeaders(List.of("*"));
                    cfg.setAllowCredentials(true);
                    return cfg;
                }))

                // 3. Stateless Session: We don't store user sessions in the server (using JWT instead)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Authorization Rules: Defining permissions for each endpoint
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (Accessible by anyone)
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/vehicles/available").permitAll() // Needed for guest discovery

                        // Protected endpoints (Role-based access)
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                        // Any other request must be authenticated
                        .anyRequest().authenticated()
                );

        // 5. JWT Filter: Attach our custom JWT filter BEFORE the standard UsernamePassword filter
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * PASSWORD ENCODER
     * Uses BCrypt hashing algorithm to securely store and verify user passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AUTHENTICATION MANAGER
     * Standard Spring Security bean used to handle the authentication process.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}