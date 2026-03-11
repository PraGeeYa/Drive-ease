package com.driveease.rental.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
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
 * SecurityConfig - Central security configuration for the application.
 * Manages CORS, CSRF, Session Policy, and URL-based permissions.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    // Injecting the custom JWT Filter
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF because JWT-based auth is immune to CSRF by design
                .csrf(csrf -> csrf.disable())

                // Configure Cross-Origin Resource Sharing (CORS) for Frontend communication
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration cfg = new CorsConfiguration();
                    // List of authorized origins (Frontend URLs)
                    cfg.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
                    cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                    cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control", "Accept"));
                    cfg.setAllowCredentials(true);
                    return cfg;
                }))

                // Set session management to STATELESS (No server-side sessions stored)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configure Authorization Rules (Who can access what)
                .authorizeHttpRequests(auth -> auth
                        // Allow Pre-flight requests (sent by browsers automatically)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public Endpoints: No authentication required
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/contact/**").permitAll()
                        .requestMatchers("/api/booking-requests/receipt/**").permitAll()
                        .requestMatchers("/api/booking-requests/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/admin/vehicles").permitAll()

                        // Role-Based Endpoints: Restricted to specific authorities
                        .requestMatchers("/api/admin/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                        .requestMatchers("/api/agent/**").hasAnyAuthority("AGENT", "ADMIN")

                        // Secure all other endpoints (Default: User must be logged in)
                        .anyRequest().authenticated()
                );

        // Tell Spring Security to run our JwtFilter before the standard UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Bean to hash passwords securely using the BCrypt algorithm.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Provides the AuthenticationManager which is responsible for authenticating users.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}