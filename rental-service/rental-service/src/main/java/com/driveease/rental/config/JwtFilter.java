package com.driveease.rental.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import javax.crypto.SecretKey;

/**
 * JwtFilter - This filter intercepts every incoming HTTP request once.
 * It checks for a valid JWT token in the Authorization header to authenticate the user.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    // The secret key used to sign and verify the JWT.
    // Must match the key used during token generation.
    private final String jwtSecret = "DriveEaseSecretKeyDriveEaseSecretKeyDriveEaseSecretKey";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Extract the Authorization header from the request
        String authHeader = request.getHeader("Authorization");

        // 2. Check if the header exists and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix to get the actual token

            try {
                // Generate the SecretKey object from our string secret
                SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

                // 3. Parse and Validate the token
                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                // 4. Extract Username and Role from the token's payload
                String username = claims.getSubject();
                Object roleObj = claims.get("role");
                String role = roleObj != null ? roleObj.toString() : null;

                // 5. If user is valid and not already authenticated in this security context
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    // Format the role to match Spring Security's expected format (e.g., ROLE_ADMIN)
                    String authorityName = (role != null) ? "ROLE_" + role : "ROLE_USER";

                    // 6. Create an Authentication object for Spring Security
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            username, null, Collections.singletonList(new SimpleGrantedAuthority(authorityName))
                    );

                    // 7. Store the authentication details in the Security Context
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                // If token is expired, tampered with, or invalid, log the error
                System.out.println("JWT Validation Error: " + e.getMessage());
            }
        }

        // 8. Continue the request to the next filter or the Controller
        filterChain.doFilter(request, response);
    }
}