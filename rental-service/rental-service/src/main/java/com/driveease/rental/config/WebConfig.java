package com.driveease.rental.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebConfig - This class configures the Global CORS (Cross-Origin Resource Sharing) settings.
 * It allows your React frontend to talk to your Spring Boot backend without being blocked.
 */
@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // 1. Enable CORS for all endpoints starting with /api/
                registry.addMapping("/api/**")

                        // 2. Allow only your React app (running on port 3000) to access the API
                        .allowedOrigins("http://localhost:3000")

                        // 3. Permitted HTTP methods for the frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")

                        // 4. Allow any request headers (like Authorization for JWT)
                        .allowedHeaders("*")

                        // 5. Allow cookies and authentication credentials to be sent
                        .allowCredentials(true);
            }
        };
    }
}